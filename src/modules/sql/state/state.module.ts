import { SqlModule } from '@core/sql';
import { Module } from '@nestjs/common';
import { State } from './entities/state.entity';
import { StateController } from './state.controller';
import { StateService } from './state.service';

@Module({
  imports: [SqlModule.register(State)],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule {}
