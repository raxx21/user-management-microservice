import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from './user.service';
import { User } from './user.interface';
import { CacheService } from '../cache/cache.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockUser = (
  id: string,
  username: string,
  blockList: string[] = [],
  name: string = 'Test',
  birthdate: string = '2024-07-06',
  surname: string = 'User',
  email: string = 'test@example.com',
  ): User => ({
  id,
  username,
  blockList,
  birthdate,
  name,
  surname,
  email,
  } as unknown as User);

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let cacheService: CacheService;

  const mockUserModel = {
    new: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(mockUser('60c72b2f5f1b2c001f8f30b1', dto.username)),
    })),
    constructor: jest.fn().mockResolvedValue(mockUser('60c72b2f5f1b2c001f8f30b1', 'testuser')),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockUser('60c72b2f5f1b2c001f8f30b1', 'testuser')]),
      } as any);
      const result = await service.findAll();
      expect(result).toEqual([mockUser('60c72b2f5f1b2c001f8f30b1', 'testuser')]);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValueOnce(null);
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser('60c72b2f5f1b2c001f8f30b1', 'testuser')),
      } as any);
      const result = await service.findOne('60c72b2f5f1b2c001f8f30b1');
      expect(result).toEqual(mockUser('60c72b2f5f1b2c001f8f30b1', 'testuser'));
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.findOne('60c72b2f5f1b2c001f8f30b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if invalid ID format', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' } as UpdateUserDto;
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser('60c72b2f5f1b2c001f8f30b1', 'updateduser')),
      } as any);
      const result = await service.update('60c72b2f5f1b2c001f8f30b1', updateUserDto);
      expect(result).toEqual(mockUser('60c72b2f5f1b2c001f8f30b1', 'updateduser'));
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' } as UpdateUserDto;
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.update('60c72b2f5f1b2c001f8f30b1', updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if invalid ID format', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' } as UpdateUserDto;
      await expect(service.update('invalid-id', updateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser('60c72b2f5f1b2c001f8f30b1', 'testuser')),
      } as any);
      await expect(service.delete('60c72b2f5f1b2c001f8f30b1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.delete('60c72b2f5f1b2c001f8f30b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if invalid ID format', async () => {
      await expect(service.delete('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('searchUsers', () => {
    it('should search users by username', async () => {
      jest.spyOn(cacheService, 'get').mockReturnValueOnce(null);
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockUser('60c72b2f5f1b2c001f8f30b2', 'searcheduser')]),
      } as any);
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUser('60c72b2f5f1b2c001f8f30b1', 'testuser')),
      } as any);
      const result = await service.searchUsers('60c72b2f5f1b2c001f8f30b1', 'searcheduser');
      expect(result).not.toEqual([]);
    });

    it('should throw NotFoundException if current user not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.searchUsers('60c72b2f5f1b2c001f8f30b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if invalid user ID format', async () => {
      await expect(service.searchUsers('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });
});
