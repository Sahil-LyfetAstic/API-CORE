import { OmitType } from '@nestjs/swagger';
import { Country } from '../entities/country.entity';

export class UpdateCountryDto extends OmitType(Country, [] as const) {}
