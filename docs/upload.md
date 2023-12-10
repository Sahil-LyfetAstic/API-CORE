
# File upload

[Back to docs](./index.md)

### Basic file upload

- Import ```MulterModule``` in Module
  ```js
  // src/modules/good/good.module.ts
  import { Module } from '@nestjs/common';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { MulterModule } from '@nestjs/platform-express';
  import { extname } from 'path';
  import { existsSync, mkdirSync } from 'fs';
  import { diskStorage } from 'multer';
  import { Good } from './entities/good.entity';
  import { uuid } from 'src/core/core.utils';

  @Module({
    imports: [
      ...
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
              cb(null, `good/${Date.now()}-${uuid()}${ext}`); // file name with path to save
            },
          }),
        }),
        inject: [ConfigService],
      }),
    ],
    ...
  })
  export class GoodModule {}
  ```
- Define dto for upload API
  ```js
  // src/modules/good/dto/upload-good.dto.ts
  export class UploadGoodDto {
    @ApiProperty({
      type: 'string',
      format: 'binary',
      description: 'Good image file',
    })
    image_file: any;
  }
  ```
- Define route in controller
  ```js
  // src/modules/good/good.controller.ts
  /**
   * Upload
   */
  @Post('upload')
  ...
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_file'))
  async upload(
    ...
    @Body() uploadGoodDto: UploadGoodDto, // Other body parameters
    @UploadedFile() imageFile: Express.Multer.File, // Uploaded file
  ) {
    ...
  }
  ```
- Save image path using create/update function
  ```js
  job.body.image = imageFile.filename;
  ```
- Add image URL as a VIRTUAL field
  ```js
  // src/modules/good/entities/good.entity.ts
  import config from 'src/config';

  @Table
  export class Good extends Entity<Good> {
    ...
    @Column
    @ApiProperty({
      description: 'Image',
      example: 'good/sample.png',
    })
    @IsOptional()
    @IsString()
    image?: string;

    @Column(DataType.VIRTUAL)
    @ApiProperty({
      description: 'Image URL',
      example: 'http://localhost:3001/cdn/good/sample.png',
      readOnly: true,
    })
    get image_url(): string {
      return config().cdnURL + this.getDataValue('image');
    }
    ...
  }
  ```

### Upload and update body
- By using our custom file upload decorator, we can upload the file and set the filename to body object directly
  ```js
  import { FileUploads } from 'src/core/core.decorators';

  ...
  @FileUploads([
    { name: 'image_file', required: true, bodyField: 'image' },
    { name: 'license_file', required: true, bodyField: 'license' },
  ])
  // By setting required option to TRUE, request will throw BadRequestException if no file is uploaded
  // use bodyField option to set the filename to body[bodyField]
  ...
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() createTicketChatDto: CreateTicketChatDto,
  ) {
    console.log(createTicketChatDto);
    // { ..., image: 'images/avatar.png', license: 'licenses/sample.pdf' }
  }

- Bind multiple properties
  ```js
  @FileUploads([
    {
      name: 'file',
      bodyField: { file: 'filename', file_type: 'mimetype' },
    },
  ])
  // { ..., file: 'images/avatar.png', file_type: 'image/png' }
  ```

### File Validation
- Accept image files only
  ```js
  @Module({
    imports: [
      ...
      MulterModule.registerAsync({
        imports: [ConfigModule],
        useFactory: () => ({
          storage: /* Storage */,
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
            // UploadException only works with FileUploads decorator
          },
        }),
        inject: [ConfigService],
      }),
    ],
    ...
  })
  export class GoodModule {}
  ```
### Use different CDN
- Change CDN globally by changing cdnStorage in config
  ```js
  // src/config/index.ts
  export default () => ({
    ...
    /**
     * @property {CDNStorage} cdnStorage
     * Default CDN storage, eg: Local Drive, Aws S3, Azure Storage, etc
     * @default 0 (Local Storage)
     */
    cdnStorage: CDNStorage.Local, // 
    ...
  })
  ```
- Change CDN for specific router using FileUploads option 
  ```js
  @FileUploads([
    { name: 'image_file', required: true, bodyField: 'image' },
    { name: 'license_file', required: true, bodyField: 'license' },
  ], { cdn: CDNStorage.Local })
  ```
- Change CDN for specific file using FileUploads option 
  ```js
  @FileUploads([
    { name: 'image_file', required: true, bodyField: 'image', cdn: CDNStorage.Local, storage: { /* multer local storage config */ } },
    { name: 'license_file', required: true, bodyField: 'license', cdn: CDNStorage.Aws, storage: { /* multer s3 storage config */ }  },
  ])
  ```

### Upload to S3 bucket

- Configure AWS and S3 in .env
  ```bash
  ## APP
  ...
  CDN_URL=https://<BUCKET_NAME>.s3.amazonaws.com/
  ```
- Set cdnStorage to aws in config
  ```js
  // src/config/index.ts
  export default () => ({
    ...
    /**
     * @property {CDNStorage} cdnStorage
     * Default CDN storage, eg: Local Drive, Aws S3, Azure Storage, etc
     * @default 0 (Local Storage)
     */
    cdnStorage: CDNStorage.Aws,
    ...
  })
  ```
- Configure ```MulterModule``` for S3 upload
  ```bash
  # install multer for s3
  $ npm i @aws-sdk/client-s3 multer-s3 
  $ npm i -D @types/multer-s3
  # OR
  $ yarn add @aws-sdk/client-s3 multer-s3
  $ yarn add -D @types/multer-s3
  ```
  ````js
  // src/modules/good/good.module.ts
  import { S3Client } from '@aws-sdk/client-s3';
  import * as multerS3 from 'multer-s3';

  const s3 = new S3Client({});

  @Module({
    imports: [
      ...
      MulterModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (
          configService: ConfigService,
        ) => {
          return {
            storage: multerS3({
              s3: s3,
              bucket: '<BUCKET_NAME>',
              acl: 'public-read', // optional
              key: function (req, file, cb) {
                const ext = extname(file.originalname);
                cb(null, `good/${Date.now()}-${uuid()}${ext}`); // key name to save
              },
              contentType: function (req, file, cb) {
                cb(null, file.mimetype);
              },
            }),
          };
        },
        inject: [ConfigService],
      }),
    ],
    ...
  })
  export class GoodModule {}
  ````


### References
- <a target="_blank" href="https://github.com/expressjs/multer">Multer</a>
- <a target="_blank" href="https://github.com/badunk/multer-s3">Multer S3</a>
- <a target="_blank" href="https://docs.nestjs.com/techniques/file-upload">Nest JS file upload</a>