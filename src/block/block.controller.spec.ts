import { Test, TestingModule } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

describe('BlockController', () => {
  let controller: BlockController;
  let service: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockController],
      providers: [
        {
          provide: BlockService,
          useValue: {
            blockUser: jest.fn(),
            unblockUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BlockController>(BlockController);
    service = module.get<BlockService>(BlockService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
