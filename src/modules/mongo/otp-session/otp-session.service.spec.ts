import { Test, TestingModule } from '@nestjs/testing';
import { OtpSessionService } from './otp-session.service';

describe('OtpSessionService', () => {
  let service: OtpSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpSessionService],
    }).compile();

    service = module.get<OtpSessionService>(OtpSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
