import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import seeds from 'src/seeds/mongo';
import { SeedReference } from './seeder.dto';

@Injectable()
export class SeederService {
  private logger: Logger = new Logger('MongoSeeder');

  constructor(@InjectConnection() private connection: Connection) {}

  async seed() {
    this.logger.log('Started');
    for (let index = 0; index < seeds.length; index++) {
      const seed = seeds[index];
      this.logger.log(`Model: ${seed.model}`);
      if (typeof this.connection.models[seed.model] === 'undefined') {
        this.logger.log(`Ignoring - ${seed.model} model not available`);
        continue;
      }
      if (seed.action === 'never') {
        this.logger.log(`Ignoring - ${seed.model} not required`);
        continue;
      } else if (seed.action === 'once') {
        try {
          const count = await this.connection.models[seed.model].count();
          if (count > 0) {
            this.logger.log(`Ignoring - ${seed.model} already exist`);
            continue;
          }
        } catch (error) {
          this.logger.error(
            `Failed - count ${seed.model} ${error.message || error}`,
          );
          continue;
        }
      } else {
        try {
          await this.connection.models[seed.model].collection.drop();
        } catch (error) {
          this.logger.error(
            `Failed - empty ${seed.model} ${error.message || error}`,
          );
          continue;
        }
      }
      this.logger.log(`Seeding ${seed.model}`);
      for (let index = 0; index < seed.data.length; index++) {
        const body: any = seed.data[index];
        try {
          for (const key in body) {
            if (Object.prototype.hasOwnProperty.call(body, key)) {
              const value = body[key];
              if (value instanceof SeedReference) {
                const parent = await this.connection.models[
                  value.model
                ].findOne(value.where);
                if (parent) body[key] = parent._id;
                else body[key] = null;
              }
            }
          }
          await this.connection.models[seed.model].create(body);
        } catch (error) {
          this.logger.error(
            `Failed - seed ${seed.model} ${error.message || error}`,
          );
          this.logger.debug(body);
        }
      }
      this.logger.log(`Seeded ${seed.model}`);
    }
    this.logger.log('Completed');
  }
}
