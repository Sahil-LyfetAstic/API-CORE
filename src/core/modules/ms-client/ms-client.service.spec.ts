import { Test, TestingModule } from '@nestjs/testing';
import { MsClientService } from './ms-client.service';

describe('MsClientService', () => {
  let service: MsClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MsClientService],
    }).compile();

    service = module.get<MsClientService>(MsClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
