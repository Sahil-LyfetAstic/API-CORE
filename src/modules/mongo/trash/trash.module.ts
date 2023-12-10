import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { Trash, TrashSchema } from './entities/trash.entity';
import { TrashService } from './trash.service';

@Module({
  imports: [MongoModule.register({ name: Trash.name, schema: TrashSchema })],
  providers: [TrashService],
  exports: [TrashService],
})
export class TrashModule {}
