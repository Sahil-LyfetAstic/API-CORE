import { OmitType } from '@nestjs/swagger';
import { Page } from '../entities/page.entity';

export class CreatePageDto extends OmitType(Page, ['active'] as const) {}
