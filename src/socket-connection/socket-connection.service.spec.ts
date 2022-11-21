import { Test, TestingModule } from '@nestjs/testing';
import { SocketConnectionService } from './socket-connection.service';

describe('SocketConnectionService', () => {
  let service: SocketConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketConnectionService],
    }).compile();

    service = module.get<SocketConnectionService>(SocketConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
