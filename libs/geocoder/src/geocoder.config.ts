import { registerAs } from '@nestjs/config';
import * as NodeGeocoder from 'node-geocoder';

export default registerAs(
  'geocoder',
  (): NodeGeocoder.Options => ({
    provider: 'google',
    apiKey: process.env.GOOGLE_MAP_API_KEY,
  }),
);
