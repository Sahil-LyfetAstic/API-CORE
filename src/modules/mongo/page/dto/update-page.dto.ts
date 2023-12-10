import { OmitType } from '@nestjs/swagger';
import { Page } from '../entities/page.entity';

export class UpdatePageDto extends OmitType(Page, [
  'name',
  'allow_html',
] as const) {}
