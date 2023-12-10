
# Socket IO

[Back to docs](./index.md)

### How to setup?

- Enable Socket IO in config
  ```js
  // src/config/index.ts
  export default () => ({
    ...
    /**
     * @property {boolean} useSocketIO
     * Enable Socket IO
     * @default false
     */
    useSocketIO: true,
    ...
  })
  ```

### Working with SocketIO

- Connected user details can be accessed from auth property

  ````js
  // src/app.gateway.ts
  export class AppGateway {
    ...
    handleConnection(client: AuthenticatedSocket) {
      console.log(client.auth);
    }
    ...
  }
  ````
- Listen for an event
  ````js
  // src/app.gateway.ts
  export class AppGateway {
    ...
    @SubscribeMessage('hello-world') // listening hello-world event
    helloWorld(client: AuthenticatedSocket, data: any): any {
      console.log(client);
      console.log(data);
    }
    ...
  }
  ````
- Emit events to clients
  ```js
  import { RedisPropagatorService } from './core/modules/socket/redis-propagator/redis-propagator.service';

  export class DemoService {

    constructor(private redisPropagatorService: RedisPropagatorService) {}

    /* Emit to single user using userId */
    sendHello(): string {
      this.redisPropagatorService.propagateEvent({
        userId: `${userId}`,
        event: 'message',
        data: {
          text: 'hello',
        },
      });
    }

    /* Emit to all authenticated users  */
    sendHelloToAuthenticated(): string {
      this.redisPropagatorService.emitToAuthenticated({
        event: 'message',
        data: {
          text: 'hello',
        },
      });
    }

    /* Emit to all users  */
    sendHelloToAll(): string {
      this.redisPropagatorService.emitToAll({
        event: 'message',
        data: {
          text: 'hello',
        },
      });
    }

    /* Emit to all users with Role Admin  */
    sendHelloToAdmins(): string {
      this.redisPropagatorService.emitToRole({
        role: 'Admin', // user.role
        event: 'message',
        data: {
          text: 'hello',
        },
      });
    }

    /* OR */ 

    /* Emit to admin room  */
    sendHelloToAdmins(): string {
      this.redisPropagatorService.emitToRoom({
        room: 'ROLE_Admin',
        event: 'message',
        data: {
          text: 'hello',
        },
      });
    }
  }
  ```

## References
- <a target="_blank" href="https://socket.io/docs/v4/">SocketIO</a>
- <a target="_blank" href="https://docs.nestjs.com/websockets/gateways">WebSockets Nest JS</a>