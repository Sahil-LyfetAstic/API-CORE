import { Test, TestingModule } from '@nestjs/testing';
import { SqlService } from './sql.service';

describe('SqlService', () => {
  let service: SqlService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqlService],
    }).compile();

    service = module.get<SqlService<any>>(SqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
