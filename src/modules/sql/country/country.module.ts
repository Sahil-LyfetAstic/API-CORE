import { SqlModule } from '@core/sql';
import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { Country } from './entities/country.entity';

@Module({
  imports: [SqlModule.register(Country)],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
