import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(CacheService) private readonly cacheService: CacheService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const cachedUser = this.cacheService.get<User>(`user:${id}`);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    this.cacheService.set(`user:${id}`, user);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    this.cacheService.set(`user:${id}`, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    this.cacheService.delete(`user:${id}`);
  }

  async searchUsers(userId: string, username?: string, minAge?: number, maxAge?: number): Promise<User[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const cacheKey = `search:${username || ''}:${minAge || ''}:${maxAge || ''}`;
    const cachedUsers = this.cacheService.get<User[]>(cacheKey);
    if (cachedUsers) {
      return cachedUsers;
    }

    const currentUser = await this.userModel.findById(userId).exec();
    if (!currentUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const blockedUsers = currentUser.blockList || [];

    const query: any = {};
    if (username) {
      query.username = { $regex: username, $options: 'i' };
    }
    if (minAge || maxAge) {
      const currentYear = new Date().getFullYear();
      query.birthdate = {};
      if (minAge) {
        query.birthdate.$lte = new Date(currentYear - minAge, 11, 31);
      }
      if (maxAge) {
        query.birthdate.$gte = new Date(currentYear - maxAge, 0, 1);
      }
    }

    const validBlockedUsers = blockedUsers.filter(id => Types.ObjectId.isValid(id));
    const exclusionList = validBlockedUsers.map(id => new Types.ObjectId(id)).concat(new Types.ObjectId(userId));
  
    if (exclusionList.length > 0) {
      query._id = { $nin: exclusionList };
    }

    const users = await this.userModel.find(query).exec();
    this.cacheService.set(cacheKey, users);
    return users;
  }
}
