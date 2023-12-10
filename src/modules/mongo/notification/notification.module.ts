import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MsClientModule } from 'src/core/modules/ms-client/ms-client.module';
import { TemplateModule } from '../template/template.module';
import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [MsClientModule, TemplateModule, UserModule, ConfigModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
