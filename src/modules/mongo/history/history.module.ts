import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { History, HistorySchema } from './entities/history.entity';
import { HistoryService } from './history.service';

@Module({
  imports: [
    MongoModule.register({ name: History.name, schema: HistorySchema }),
  ],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
