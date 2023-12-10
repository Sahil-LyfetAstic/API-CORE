import {
  INestApplicationContext,
  Logger,
  WebSocketAdapter,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';

import { UserService } from '../../../../modules/sql/user/user.service';
import { OwnerDto } from '../../../decorators/sql/owner.decorator';
import { SessionService } from '../../session/session.service';
import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';
import { SocketStateService } from './socket-state.service';

export interface AuthenticatedSocket extends Socket {
  auth: OwnerDto;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  private readonly logger = new Logger('AppGateway');
  private socketServer: Server;

  public constructor(
    readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
    private readonly userService: UserService,
    private readonly session: SessionService,
  ) {
    super(app);
  }

  public create(port: number, options: ServerOptions): Server {
    this.socketServer = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(this.socketServer);

    this.socketServer.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        (Array.isArray(socket.handshake.query.token)
          ? socket.handshake.query.token[0]
          : socket.handshake.query.token) ||
        socket.handshake.headers.authorization;

      if (!token) {
        // guest login
        socket.auth = null;
        return next();
      }
      try {
        const { error: validateError, data: session } =
          this.session.verifyToken(token);
        if (validateError) {
          socket.disconnect();
          return next(validateError);
        }
        const { error, data } = await this.userService.$db.findOneRecord({
          options: {
            where: {
              id: session.userId,
            },
            allowEmpty: true,
          },
        });
        if (error || !data || !data.getDataValue('active')) {
          socket.disconnect();
          return next(validateError);
        }
        socket.auth = { ...data.toJSON(), ...session };
        socket.join(`ROLE_${data.getDataValue('role')}`);
        return next();
      } catch (e) {
        return next(e);
      }
    });
    return this.socketServer;
  }

  public bindClientConnect(server: Server, callback: any): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.add(`${socket.auth.userId}`, socket);
        socket.on('disconnect', () => {
          this.socketStateService.remove(`${socket.auth.userId}`, socket);
          socket.removeAllListeners('disconnect');
        });
      }
      callback(socket);
    });
  }

  public joinRoom({ uid, room }) {
    const sockets = this.socketStateService.get(uid);
    if (sockets && sockets.length) {
      for (const socket of sockets) {
        socket.join(room);
      }
      this.logger.log(`UID ${uid} join room ${room}`);
    }
  }

  public leaveRoom({ uid, room }) {
    const sockets = this.socketStateService.get(uid);
    if (sockets && sockets.length) {
      for (const socket of sockets) {
        socket.leave(room);
      }
      this.logger.log(`UID ${uid} left room ${room}`);
    }
  }

  public sendToRoom({ chanel, room, payload }) {
    this.socketServer.in(room).emit(chanel, payload);
    this.logger.log(`Message sent to room ${room} chanel ${chanel}`);
    this.logger.log(payload);
  }

  public broadcast({ chanel, payload }) {
    this.socketServer.emit(chanel, payload);
    this.logger.log(`Broadcasted to chanel ${chanel}`);
    this.logger.log(payload);
  }
}
