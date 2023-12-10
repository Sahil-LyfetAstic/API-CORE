import { SqlModule } from '@core/sql';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Page } from './entities/page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';

@Module({
  imports: [SqlModule.register(Page), ConfigModule],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
