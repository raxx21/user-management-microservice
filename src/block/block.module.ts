import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { UserModule } from '../user/user.module'; 
import { UserSchema } from '../user/user.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), 
    UserModule,
  ],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}
