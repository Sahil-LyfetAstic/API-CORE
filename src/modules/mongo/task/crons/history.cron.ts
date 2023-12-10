import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HistoryService } from '../../history/history.service';

@Injectable()
export class HistoryCron {
  private logger: Logger = new Logger(`Cron - ${HistoryService.name}`);
  constructor(private _historyService: HistoryService) {}

  // delete expired history
  @Cron('0 0 0 * * *')
  async deleteExpiredHistory() {
    this.logger.log('History expired cron started...');
    const { error } = await this._historyService.$db.deleteBulkRecords({
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
    this.logger.log(`History expired cron completed successfully!`);
  }
}
