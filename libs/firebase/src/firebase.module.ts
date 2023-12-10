import firebaseConfig from '@core/firebase/firebase.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseAdminModule } from './admin';

@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [firebaseConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('firebase'),
    }),
  ],
  exports: [],
  providers: [],
})
export class FirebaseModule {}
