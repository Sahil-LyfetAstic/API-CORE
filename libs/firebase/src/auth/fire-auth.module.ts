import { Module } from '@nestjs/common';
import { MsClientModule } from 'src/core/modules/ms-client/ms-client.module';
import { FirebaseModule } from '../firebase.module';
import { FireAuthController } from './fire-auth.controller';
import { FireAuthService } from './fire-auth.service';

@Module({
  imports: [FirebaseModule, MsClientModule],
  controllers: [FireAuthController],
  providers: [FireAuthService],
  exports: [FireAuthService],
})
export class FireAuthModule {}
