import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../../../config/jwt';
import { SessionService } from './session.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('jwt'),
    }),
  ],
  exports: [JwtModule, SessionService],
  providers: [SessionService],
})
export class SessionModule {}
