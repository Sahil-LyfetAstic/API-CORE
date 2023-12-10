import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { Country, CountrySchema } from './entities/country.entity';

@Module({
  imports: [
    MongoModule.register({ name: Country.name, schema: CountrySchema }),
  ],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
