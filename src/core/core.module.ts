import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';
import { existsSync, mkdirSync } from 'fs';
import { MsClientModule } from 'src/core/modules/ms-client/ms-client.module';
import config from '../config';
import { CachingModule } from './modules/caching/caching.module';
import { SessionModule } from './modules/session/session.module';
import { SocketModule } from './modules/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CachingModule,
    MsClientModule,
    SessionModule,
    SocketModule,
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const cdnStatic = config.get('cdnStatic');
        const cdnPath = config.get('cdnPath');
        const cdnServeRoot = config.get('cdnServeRoot');
        const paths: ServeStaticModuleOptions[] = [];
        if (cdnStatic) {
          existsSync(cdnPath) || mkdirSync(cdnPath);
          paths.push({
            rootPath: cdnPath,
            serveRoot: cdnServeRoot,
          });
        }
        return paths;
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('throttler'),
    }),
  ],
  exports: [ConfigModule, ServeStaticModule, ThrottlerModule],
})
export class CoreModule {}
