import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseNotificationService } from './firebase-notification.service';

describe('FirebaseNotificationService', () => {
  let service: FirebaseNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseNotificationService],
    }).compile();

    service = module.get<FirebaseNotificationService>(
      FirebaseNotificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
