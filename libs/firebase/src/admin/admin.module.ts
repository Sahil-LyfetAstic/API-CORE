import { DynamicModule, Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  FIREBASE_ADMIN_INJECT,
  FIREBASE_ADMIN_MODULE_OPTIONS,
} from './admin.constant';
import { FirebaseAdminModuleAsyncOptions } from './admin.interface';

@Global()
@Module({})
export class FirebaseAdminModule {
  static forRoot(options: admin.AppOptions): DynamicModule {
    const firebaseAdminModuleOptions = {
      provide: FIREBASE_ADMIN_MODULE_OPTIONS,
      useValue: options,
    };

    const app =
      admin.apps.length === 0 ? admin.initializeApp(options) : admin.apps[0];

    const firebaseAuthenticationProvider = {
      provide: FIREBASE_ADMIN_INJECT,
      useValue: app,
    };

    return {
      module: FirebaseAdminModule,
      providers: [firebaseAdminModuleOptions, firebaseAuthenticationProvider],
      exports: [firebaseAdminModuleOptions, firebaseAuthenticationProvider],
    };
  }

  static forRootAsync(options: FirebaseAdminModuleAsyncOptions): DynamicModule {
    const firebaseAdminModuleOptions = {
      provide: FIREBASE_ADMIN_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const firebaseAuthenticationProvider = {
      provide: FIREBASE_ADMIN_INJECT,
      useFactory: (opt: admin.AppOptions) => {
        const app =
          admin.apps.length === 0 ? admin.initializeApp(opt) : admin.apps[0];

        return app;
      },
      inject: [FIREBASE_ADMIN_MODULE_OPTIONS],
    };

    return {
      module: FirebaseAdminModule,
      imports: options.imports,
      providers: [firebaseAdminModuleOptions, firebaseAuthenticationProvider],
      exports: [firebaseAdminModuleOptions, firebaseAuthenticationProvider],
    };
  }
}
