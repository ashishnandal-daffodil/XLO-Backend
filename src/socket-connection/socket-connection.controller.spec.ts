import { Test, TestingModule } from '@nestjs/testing';
import { SocketConnectionController } from './socket-connection.controller';
import { SocketConnectionService } from './socket-connection.service'

describe('SocketConnectionController', () => {
  let controller: SocketConnectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocketConnectionController],
      providers: [SocketConnectionService]
    }).compile();

    controller = module.get<SocketConnectionController>(SocketConnectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
