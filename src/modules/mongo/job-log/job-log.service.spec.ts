import { Test, TestingModule } from '@nestjs/testing';
import { JobLogService } from './job-log.service';

describe('JobLogService', () => {
  let service: JobLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobLogService],
    }).compile();

    service = module.get<JobLogService>(JobLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
