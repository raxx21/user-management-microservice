import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from './block.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { User } from '../user/user.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BlockService', () => {
  let blockService: BlockService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockService,
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    blockService = module.get<BlockService>(BlockService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(blockService).toBeDefined();
  });

  describe('blockUser', () => {
    it('User blocked successfully', async () => {
      const userId = '60c72b2f5f1b2c001f8f30b1';
      const blockId = '669127c96bce2abb2aa90c43';
      const mockUser = {
        _id: userId,
        username: 'testuser1',
        blockList: [],
        save: jest.fn().mockResolvedValue(true),
      };

      const mockBlockUser = {
        _id: blockId,
        username: 'test1',
        blockList: [],
      };

      jest.spyOn(userModel, 'findById')
      .mockReturnThis()
      .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockBlockUser as any)
      } as unknown as Query<User, any>);
      // jest.spyOn(userModel, 'findById').mockResolvedValueOnce(mockBlockUser as any);
      jest.spyOn(userModel, 'findById')
      .mockReturnThis()
      .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockUser as any)
      } as unknown as Query<User, any>)

      await blockService.blockUser(userId, blockId);

      expect(mockUser.blockList).toContain(blockId);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if trying to block oneself', async () => {
      const userId = '60c72b2f5f1b2c001f8f30b1';

      await expect(blockService.blockUser(userId, userId)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is already blocked', async () => {
      const userId = '60c72b2f5f1b2c001f8f30b1';
      const blockId = '668f7bb8db60cba6d8ed19d2';
      const mockUser = {
        _id: userId,
        username: 'testuser1',
        blockList: [blockId],
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(userModel, 'findById')
      .mockReturnThis()
      .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockUser as any)
      } as unknown as Query<User, any>);

      await expect(blockService.blockUser(userId, blockId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('unblockUser', () => {
    it('should unblock a user', async () => {
      const userId = '60c72b2f5f1b2c001f8f30b1';
      const blockId = '668f7bb8db60cba6d8ed19d2';
      const mockUser = {
        _id: userId,
        username: 'testuser1',
        blockList: [blockId],
        save: jest.fn().mockResolvedValue(true), // Mock save method
      };
      
      jest.spyOn(userModel, 'findById')
      .mockReturnThis()
      .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockUser as any)
      } as unknown as Query<User, any>);

      await blockService.unblockUser(userId, blockId);

      expect(mockUser.blockList).not.toContain(blockId);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user is not blocked', async () => {
      const userId = '60c72b2f5f1b2c001f8f30b1';
      const blockId = '668f7bb8db60cba6d8ed19d2';
      const mockUser = {
        _id: userId,
        username: 'testuser1',
        blockList: [],
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(userModel, 'findById')
      .mockReturnThis()
      .mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(mockUser as any)
      } as unknown as Query<User, any>);

      await expect(blockService.unblockUser(userId, blockId)).rejects.toThrow(BadRequestException);
    });
  });
});
