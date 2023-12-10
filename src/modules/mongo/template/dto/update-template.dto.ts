import { OmitType } from '@nestjs/swagger';
import { Template } from '../entities/template.entity';

export class UpdateTemplateDto extends OmitType(Template, [
  'name',
  'active',
] as const) {}
