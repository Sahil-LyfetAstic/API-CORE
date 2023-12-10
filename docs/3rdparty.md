

<p align="center">A progressive <a href="http://nestjs.com/" target="_blank">NestJs</a> framework for building efficient and scalable server-side applications.</p>

# 3rd party libraries

[Back to docs](./index.md)

## AWS


  ```bash
  # install dependencies
  $ npm install nest-aws-sdk aws-sdk
  ```

  ```js
  // src/app.module.ts
  import { AwsModule } from './core/modules/aws/aws.module';
  import { S3Module } from './core/modules/aws/s3/s3.module'; // optional

  @Module({
    imports: [
      ...
      AwsModule,
      S3Module, // optional
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Firebase


  ```bash
  # install dependencies
  $ npm install @aginix/nestjs-firebase-admin
  ```

  ```js
  // src/app.module.ts
  import { FirebaseModule } from './core/modules/firebase/firebase.module';
  import { FirebaseNotificationModule } from './core/modules/firebase/notification/firebase-notification.module'; // optional

  @Module({
    imports: [
      ...
      FirebaseModule,
      FirebaseNotificationModule, // optional
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Nodemailer


  ```bash
  # install dependencies
  $ npm install @nestjs-modules/mailer nodemailer
  ```

  ```js
  // src/app.module.ts
  import { EmailModule } from './core/modules/email/email.module';

  @Module({
    imports: [
      ...
      EmailModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Sendgrid


  ```bash
  # install dependencies
  $ npm install @ntegral/nestjs-sendgrid @sendgrid/mail
  ```

  ```js
  // src/app.module.ts
  import { SendGridModule } from './core/modules/send-grid/send-grid.module';

  @Module({
    imports: [
      ...
      SendGridModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Twilio


  ```bash
  # install dependencies
  $ npm install nestjs-twilio twilio
  ```

  ```js
  // src/app.module.ts
  import { TwilioModule } from './core/modules/twilio/twilio.module';

  @Module({
    imports: [
      ...
      TwilioModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Stripe


  ```bash
  # install dependencies
  $ npm install nestjs-stripe stripe
  ```

  ```js
  // src/app.module.ts
  import { StripeModule } from './core/modules/stripe/stripe.module';

  @Module({
    imports: [
      ...
      StripeModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Geocoder


  ```bash
  # install dependencies
  $ npm install node-geocoder
  $ npm install -D @types/node-geocoder
  ```

  ```js
  // src/app.module.ts
  import { GeocoderModule } from './core/modules/geocoder/geocoder.module';

  @Module({
    imports: [
      ...
      GeocoderModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Google recaptcha


  ```bash
  # install dependencies
  $ npm install axios
  ```

  ```js
  // src/app.module.ts
  import { RecaptchaModule } from './core/modules/recaptcha/recaptcha.module';

  @Module({
    imports: [
      ...
      RecaptchaModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```
  - Use ``` RecaptchaAuthGuard```  as guard in required api function
  ```javascript
  // src/modules/auth/auth.controller.ts
  @Public()
  @ApiOperation(...)
  @ApiHeader({ name: 'recaptcha' }) // recaptcha response need to send through header
  @ApiOkResponse(...)
  @UseGuards(RecaptchaAuthGuard)
  @Post('password/forgot')
  async forgotPassword(
    ...
  ) {
    ...
  }
  ```