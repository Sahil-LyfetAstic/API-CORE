import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

import { RedisService } from '../redis/redis.service';
import { AuthenticatedSocket } from '../socket-state/socket-state.adapter';
import { SocketStateService } from '../socket-state/socket-state.service';
import { RedisSocketEventEmitDTO } from './dto/socket-event-emit.dto';
import { RedisSocketEventSendDTO } from './dto/socket-event-send.dto';
import {
  REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
  REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
  REDIS_SOCKET_EVENT_EMIT_ROLE_NAME,
  REDIS_SOCKET_EVENT_EMIT_ROOM_NAME,
  REDIS_SOCKET_EVENT_SEND_NAME,
} from './redis-propagator.constants';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ROOM_NAME)
      .pipe(tap(this.consumeEmitToRoomEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_ROLE_NAME)
      .pipe(tap(this.consumeEmitToRoleEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;
    return this;
  }

  private consumeSendEvent = (eventInfo: RedisSocketEventSendDTO): void => {
    const { userId, event, data, socketId } = eventInfo;
    return this.socketStateService
      .get(`${userId}`)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeEmitToAllEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    this.socketServer?.emit(eventInfo.event, eventInfo.data);
  };

  private consumeEmitToRoomEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    this.socketServer
      ?.to(`${eventInfo.room}`)
      .emit(eventInfo.event, eventInfo.data);
  };

  private consumeEmitToAuthenticatedEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    const { event, data } = eventInfo;
    return this.socketStateService
      .getAll()
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeEmitToRoleEvent = (
    eventInfo: RedisSocketEventSendDTO,
  ): void => {
    const { event, data } = eventInfo;
    return this.socketStateService
      .getAll()
      .filter(
        (socket: AuthenticatedSocket) => socket.auth?.role === eventInfo.role,
      )
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId) {
      return false;
    }
    this.redisService.publish(REDIS_SOCKET_EVENT_SEND_NAME, eventInfo);
    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(
      REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo,
    );
    return true;
  }

  public emitToRole(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.role) {
      return false;
    }
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ROLE_NAME, eventInfo);
    return true;
  }

  public emitToRoom(eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.room) {
      return false;
    }
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ROOM_NAME, eventInfo);
    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_NAME, eventInfo);
    return true;
  }
}
