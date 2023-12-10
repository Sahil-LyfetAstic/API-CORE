import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { Template, TemplateSchema } from './entities/template.entity';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
  imports: [
    MongoModule.register({ name: Template.name, schema: TemplateSchema }),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
