import { MongoModule } from '@core/mongo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Page, PageSchema } from './entities/page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  imports: [
    MongoModule.register({ name: Page.name, schema: PageSchema }),
    ConfigModule,
  ],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
