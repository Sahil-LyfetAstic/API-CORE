import { INestApplication, Logger, UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AppEngine, defaultEngine } from './app.config';
import { SessionModule } from './core/modules/session/session.module';
import { SessionService } from './core/modules/session/session.service';
import { RedisPropagatorInterceptor } from './core/modules/socket/redis-propagator/redis-propagator.interceptor';
import { RedisPropagatorService } from './core/modules/socket/redis-propagator/redis-propagator.service';
import {
  AuthenticatedSocket as AuthenticatedMongoSocket,
  SocketStateAdapter as SocketStateMongoAdapter,
} from './core/modules/socket/socket-state/socket-state-mongo.adapter';
import {
  AuthenticatedSocket,
  SocketStateAdapter,
} from './core/modules/socket/socket-state/socket-state.adapter';
import { SocketStateService } from './core/modules/socket/socket-state/socket-state.service';
import { UserModule as UserMongoModule } from './modules/mongo/user/user.module';
import { UserService as UserMongoService } from './modules/mongo/user/user.service';
import { UserModule } from './modules/sql/user/user.module';
import { UserService } from './modules/sql/user/user.service';

export const initAdapters = (app: INestApplication): INestApplication => {
  const socketStateService = app.get(SocketStateService);
  const redisPropagatorService = app.get(RedisPropagatorService);
  const sessionService = app.select(SessionModule).get(SessionService);

  if (defaultEngine === AppEngine.SQL) {
    const userService = app.select(UserModule).get(UserService);
    app.useWebSocketAdapter(
      new SocketStateAdapter(
        app,
        socketStateService,
        redisPropagatorService,
        userService,
        sessionService,
      ),
    );
  } else {
    const userService = app.select(UserMongoModule).get(UserMongoService);
    app.useWebSocketAdapter(
      new SocketStateMongoAdapter(
        app,
        socketStateService,
        redisPropagatorService,
        userService,
        sessionService,
      ),
    );
  }

  return app;
};

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseInterceptors(RedisPropagatorInterceptor)
  @SubscribeMessage('events')
  handleEvents(): any {
    return { event: 'events', data: 'socket working' };
  }

  afterInit() {
    this.logger.log('Socket server ready');
  }

  handleDisconnect(client: AuthenticatedSocket | AuthenticatedMongoSocket) {
    this.logger.log(`Client disconnected: USER_${client.auth?.id}`);
    // On sockect disconnect, write your app buisness login here
  }

  handleConnection(client: AuthenticatedSocket | AuthenticatedMongoSocket) {
    this.logger.log(`Client connected: USER_${client.auth?.id}`);
    // On sockect connect, write your app buisness login here
  }
}
