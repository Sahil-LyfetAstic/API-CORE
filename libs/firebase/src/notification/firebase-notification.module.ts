import { Module } from '@nestjs/common';
import { MsClientModule } from 'src/core/modules/ms-client/ms-client.module';
import { FirebaseAdminModule } from '../admin/admin.module';
import { FirebaseNotificationController } from './firebase-notification.controller';
import { FirebaseNotificationService } from './firebase-notification.service';

@Module({
  imports: [FirebaseAdminModule, MsClientModule],
  controllers: [FirebaseNotificationController],
  providers: [FirebaseNotificationService],
  exports: [FirebaseNotificationService],
})
export class FirebaseNotificationModule {}
