import { Seed } from '@core/mongo/seeder/seeder.dto';
import countrySeed from './country.seed';
import pageSeed from './page.seed';
import settingSeed from './setting.seed';
import stateSeed from './state.seed';
import templateSeed from './template.seed';
import userSeed from './user.seed';

const seeds: Seed<any>[] = [
  userSeed,
  pageSeed,
  countrySeed,
  stateSeed,
  settingSeed,
  templateSeed,
];

export default seeds;
