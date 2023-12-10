import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { State, StateSchema } from './entities/state.entity';
import { StateController } from './state.controller';
import { StateService } from './state.service';

@Module({
  imports: [MongoModule.register({ name: State.name, schema: StateSchema })],
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
