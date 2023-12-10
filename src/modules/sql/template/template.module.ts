import { SqlModule } from '@core/sql';
import { Module } from '@nestjs/common';
import { Template } from './entities/template.entity';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
  imports: [SqlModule.register(Template)],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
