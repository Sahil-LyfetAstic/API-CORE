
# Introduction

[Back to docs](./index.md)

## Core Modules
- NestJS integration
- Swagger api documentation
- Configurations using env variables
- Sequelize ORM for SQL databases
- Mongoose for mongodb 
- Class validator for API validations
- Redis for caching, jwt token, etc
- Passport JS for authentication
- Web sockets
- Seeder for seeding database tables
- Logging for debug
- Cron jobs
- Static files folder
- HBS template render for HTML pages
- Micro services for background tasks
- e2e testing using jest and supertest
- CLI to generate modules
- Common 3rd party services
  - Aws
    - S3
  - Firebase
    - Auth
    - Messaging
  - Nodemailer
  - Sendgrid
  - Twilio
  - Stripe

## Basic Modules

- Login
  - Login with email and password
  - Login with firebase
  - Login with facebook
  - Login with google
  - Login with apple
  - On behalf login for admin
- Forgot Password
  - Receive OTP via email and phone number
  - Resent OTP
  - Verify OTP
  - Reset password
- Generate new token
- Logout
- Users
  - List users
  - Add/Edit/Delete users
  - Get logged in user
  - Update logged in user
  - Change password
- User Roles
- Country
- State
- Page (CMS Pages)
  - Manage CMS pages
  - CMS page webview
- Template (Email and SMS Templates)
- Setting (Configurations from database)
- Good (Dummy module for reference)
  - List all goods
    - Search using keywords
    - Offset and limit for pagination
    - Select specific fields only
    - Filter result using basic operaors like equals, greater than, in array, etc
    - Sort result
    - Populate/Join related records
    - Upload good image
  - Create/Update/Delete goods
  - Get a specific good using it's id
  - Search and get a specific good using where conditions