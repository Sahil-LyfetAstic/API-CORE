import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { Setting, SettingSchema } from './entities/setting.entity';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

@Module({
  imports: [
    MongoModule.register({ name: Setting.name, schema: SettingSchema }),
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
