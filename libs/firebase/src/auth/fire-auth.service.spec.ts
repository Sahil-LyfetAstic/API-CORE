import { Test, TestingModule } from '@nestjs/testing';
import { FireAuthService } from './fire-auth.service';

describe('FireAuthService', () => {
  let service: FireAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FireAuthService],
    }).compile();

    service = module.get<FireAuthService>(FireAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
