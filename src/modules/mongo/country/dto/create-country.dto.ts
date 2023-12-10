import { OmitType } from '@nestjs/swagger';
import { Country } from '../entities/country.entity';

export class CreateCountryDto extends OmitType(Country, ['active'] as const) {}
