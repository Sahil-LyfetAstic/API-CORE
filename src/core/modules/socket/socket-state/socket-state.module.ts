import { Module } from '@nestjs/common';
import { SessionModule } from '../../session/session.module';
import { SocketStateService } from './socket-state.service';

@Module({
  imports: [SessionModule],
  providers: [SocketStateService],
  exports: [SocketStateService],
})
export class SocketStateModule {}
