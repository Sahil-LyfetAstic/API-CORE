import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { JobLogModule } from 'src/modules/mongo/job-log/job-log.module';
import msConfig from '../../../config/ms';
import { MsClientService } from './ms-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WORKER_SERVICE',
        imports: [
          ConfigModule.forRoot({
            load: [msConfig],
          }),
        ],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => config.get('ms'),
      },
    ]),
    JobLogModule,
  ],
  providers: [MsClientService],
  exports: [MsClientService],
})
export class MsClientModule {}
