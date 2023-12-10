import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TrashService } from '../../trash/trash.service';

@Injectable()
export class TrashCron {
  private logger: Logger = new Logger(`Cron - ${TrashService.name}`);
  constructor(private _trashService: TrashService) {}

  // delete expired trash
  @Cron('0 0 0 * * *')
  async deleteExpiredTrash() {
    this.logger.log('Trash expired cron started...');
    const { error } = await this._trashService.$db.deleteBulkRecords({
      options: {
        hardDelete: true,
        where: {
          expire_in: {
            $lte: new Date(),
          },
        },
      },
    });

    if (error) {
      this.logger.error(`Error - ${error.message || error}`);
      return;
    }
    this.logger.log(`Trash expired cron completed successfully!`);
  }
}
