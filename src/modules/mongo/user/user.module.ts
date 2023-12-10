import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadException } from 'src/core/core.errors';
import { generateHash, uuid } from 'src/core/core.utils';
import { User, UserSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongoModule.registerAsync({
      name: User.name,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const schema = UserSchema;
        schema.pre('save', async function (next) {
          if (this.isNew) {
            this.uid = uuid();
            if (this.password) {
              this.password = await generateHash(this.password);
            }
          }
          if (this.first_name && this.last_name) {
            this.name = `${this.first_name} ${this.last_name}`;
          }
          next();
        });
        schema.virtual('avatar_url').get(function () {
          return this.avatar ? configService.get('cdnURL') + this.avatar : '';
        });
        return schema;
      },
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // use diskStorage to store files locally
        // files will be uploaded to path specified as cdnPath in config
        storage: diskStorage({
          destination: function (req, file, cb) {
            const uploadPath = configService.get('cdnPath');
            existsSync(uploadPath) || mkdirSync(uploadPath);
            cb(null, uploadPath);
          },
          filename: function (req, file, cb) {
            const ext = extname(file.originalname);
            cb(null, `user/${Date.now()}-${uuid()}${ext}`); // file name to save
          },
        }),
        fileFilter: function (req, file, cb) {
          const ext = extname(file.originalname);
          const validExtensions = ['.png', '.jpeg', '.jpg'];
          const validMimetypes = ['image/png', 'image/jpeg', 'image/jpg'];
          if (
            validMimetypes.includes(file.mimetype) &&
            validExtensions.includes(ext)
          )
            return cb(null, true);
          return cb(
            new UploadException({
              file,
              field: file.fieldname,
              message: 'File should be a valid image file',
            }),
            false,
          );
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
