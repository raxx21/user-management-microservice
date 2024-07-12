import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.interface';

@Injectable()
export class BlockService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async blockUser(userId: string, blockId: string): Promise<void> {
    if (userId === blockId) {
      throw new BadRequestException('You cannot block yourself');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    if (user.blockList.includes(blockId)) {
      throw new BadRequestException('User is already blocked');
    }

    user.blockList.push(blockId);
    await user.save();
  }

  async unblockUser(userId: string, blockId: string): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const index = user.blockList.indexOf(blockId);
    if (index === -1) {
      throw new BadRequestException('User is not blocked');
    }

    user.blockList.splice(index, 1);
    await user.save();
  }
}
