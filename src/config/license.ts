
import { registerAs } from '@nestjs/config';

export default registerAs('license', () => ({
  apiKey: process.env.CRYPTOLENS_API_KEY,
  rsaPublicKey: process.env.CRYPTOLENS_RSA_PUBLIC_KEY,
  productId: parseInt(process.env.CRYPTOLENS_PRODUCT_ID, 10),
  token: process.env.CRYPTOLENS_TOKEN,
}));
