import { OmitType } from '@nestjs/swagger';
import { State } from '../entities/state.entity';

export class UpdateStateDto extends OmitType(State, [] as const) {}
