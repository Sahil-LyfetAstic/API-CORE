import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { QueryGuard } from 'src/core/guards/query.guard';
import { SettingsInterceptor as MongoSettingsInterceptor } from 'src/core/interceptors/mongo/settings.interceptors';
import { SettingsInterceptor } from 'src/core/interceptors/sql/settings.interceptors';
import { AppEngine, defaultEngine } from '../app.config';
import { AuthModule as MongoAuthModule } from './mongo/auth/auth.module';
import { RolesGuard as MongoRolesGuard } from './mongo/auth/roles.guard';
import { JwtAuthGuard as MongoJwtAuthGuard } from './mongo/auth/strategies/jwt/jwt-auth.guard';
import { LocalAuthModule as MongoLocalAuthModule } from './mongo/auth/strategies/local/local-auth.module';
import { CountryModule as CountryMongoModule } from './mongo/country/country.module';
import { HistoryModule } from './mongo/history/history.module';
import { LoginLogModule } from './mongo/login-log/login-log.module';
import { NotificationModule as MongoNotificationModule } from './mongo/notification/notification.module';
import { OtpSessionModule } from './mongo/otp-session/otp-session.module';
import { PageModule as PageMongoModule } from './mongo/page/page.module';
import { SettingModule as SettingMongoModule } from './mongo/setting/setting.module';
import { StateModule as StateMongoModule } from './mongo/state/state.module';
import { TaskModule } from './mongo/task/task.module';
import { TemplateModule as TemplateMongoModule } from './mongo/template/template.module';
import { TrashModule } from './mongo/trash/trash.module';
import { UserModule as UserMongoModule } from './mongo/user/user.module';
import { AuthModule } from './sql/auth/auth.module';
import { RolesGuard } from './sql/auth/roles.guard';
import { JwtAuthGuard } from './sql/auth/strategies/jwt/jwt-auth.guard';
import { LocalAuthModule } from './sql/auth/strategies/local/local-auth.module';
import { CountryModule } from './sql/country/country.module';
import { NotificationModule } from './sql/notification/notification.module';
import { PageModule } from './sql/page/page.module';
import { SettingModule } from './sql/setting/setting.module';
import { StateModule } from './sql/state/state.module';
import { TemplateModule } from './sql/template/template.module';
import { UserModule } from './sql/user/user.module';

export interface CommonModuleOption {
  defaultEngine?: AppEngine;
}

@Module({})
export class CommonModule {
  static register(): DynamicModule {
    // common imports
    const imports = [
      TaskModule,
      HistoryModule,
      TrashModule,
      LoginLogModule,
      OtpSessionModule,
    ];

    // common providers
    const providers: any = [
      {
        provide: APP_GUARD,
        useClass: QueryGuard,
      },
    ];

    // checking the default engine
    if (defaultEngine === AppEngine.Mongo) {
      // mongo modules
      const modules = [
        MongoAuthModule,
        MongoLocalAuthModule,
        UserMongoModule,
        PageMongoModule,
        TemplateMongoModule,
        SettingMongoModule,
        CountryMongoModule,
        StateMongoModule,
        MongoNotificationModule,
      ];
      imports.push(...modules);

      // mongo providers
      providers.push(
        ...[
          {
            provide: APP_GUARD,
            useClass: MongoJwtAuthGuard,
          },
          {
            provide: APP_GUARD,
            useClass: MongoRolesGuard,
          },
          {
            provide: APP_INTERCEPTOR,
            useClass: MongoSettingsInterceptor,
          },
        ],
      );
    } else {
      // sql modules
      const modules = [
        AuthModule,
        LocalAuthModule,
        UserModule,
        PageModule,
        TemplateModule,
        SettingModule,
        CountryModule,
        StateModule,
        NotificationModule,
      ];
      imports.push(...modules);

      // sql providers
      providers.push(
        ...[
          {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
          },
          {
            provide: APP_GUARD,
            useClass: RolesGuard,
          },
          {
            provide: APP_INTERCEPTOR,
            useClass: SettingsInterceptor,
          },
        ],
      );
    }
    return {
      module: CommonModule,
      imports,
      providers,
    };
  }
}
