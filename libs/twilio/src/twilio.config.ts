import { registerAs } from '@nestjs/config';

export default registerAs(
  'twilio',
  (): {
    accountSid?: string;
    authToken?: string;
    from?: string;
  } => ({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER,
  }),
);
