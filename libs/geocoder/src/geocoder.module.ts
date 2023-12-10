import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import geocoderConfig from './geocoder.config';
import { GeocoderService } from './geocoder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [geocoderConfig],
    }),
  ],
  providers: [GeocoderService],
  exports: [GeocoderService],
})
export class GeocoderModule {}
