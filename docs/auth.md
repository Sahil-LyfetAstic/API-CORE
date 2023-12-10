

# Authentication

[Back to docs](./index.md)

## Local Authentication and JWT Guard

  ```js
  // src/app.module.ts
  import { LocalAuthModule } from './modules/auth/local/local-auth.module';
  import { JwtAuthGuard } from './modules/auth/jwt/jwt-auth.guard';

  @Module({
    imports: [
      ...
      LocalAuthModule,
      ...
    ],
    providers: [
      ...
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Google Social Login

  ```bash
  # install dependencies
  $ npm install passport-google-verify-token
  ```
  
  ```js
  // src/app.module.ts
  import { GoogleAuthModule } from './modules/auth/google/google-auth.module';

  @Module({
    imports: [
      ...
      GoogleAuthModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Facebook Social Login


  ```bash
  # install dependencies
  $ npm install passport-facebook-token
  ```
  
  ```js
  // src/app.module.ts
  import { FacebookAuthModule } from './modules/auth/facebook/facebook-auth.module';

  @Module({
    imports: [
      ...
      FacebookAuthModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Apple Social Login

  
  ```bash
  # install dependencies
  $ npm install passport-apple-verify-token
  ```
  
  ```js
  // src/app.module.ts
  import { AppleAuthModule } from './modules/auth/apple/apple-auth.module';

  @Module({
    imports: [
      ...
      AppleAuthModule,
      ...
    ],
    ...
  })
  export class AppModule {}
  ```

## Firebase Authentication

  
  ```bash
  # install dependencies
  $ npm install passport-apple-verify-token
  ```
  
  ```js
  // src/app.module.ts
  import { FirebaseAuthModule } from './modules/auth/firebase/firebase-auth.module';
  import { FirebaseModule } from './core/modules/firebase/firebase.module';
  import { FirebaseJwtAuthGuard } from './modules/auth/firebase-jwt/firebase-jwt-auth.guard';

  @Module({
    imports: [
      ...
      FirebaseModule,
      FirebaseAuthModule,
      ...
    ],
    providers: [
      ...
      {
        provide: APP_GUARD,
        useClass: FirebaseJwtAuthGuard,
      },
      ...
    ],
    ...
  })
  export class AppModule {}
  ```
