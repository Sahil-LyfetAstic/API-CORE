import emailConfig from '@core/email/email.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MsClientModule } from 'src/core/modules/ms-client/ms-client.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [emailConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('email'),
    }),
    MsClientModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
