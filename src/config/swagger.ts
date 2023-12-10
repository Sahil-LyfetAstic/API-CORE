import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { APP_NAME, APP_VERSION } from 'src/app.config';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle(APP_NAME)
  .setDescription(`${APP_NAME} API description`)
  .setVersion(`v${APP_VERSION}`)
  .addBearerAuth()
  .build();

export const SwaggerOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};
