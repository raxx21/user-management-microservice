import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheService } from './cache/cache.service';
import { ExtractUserMiddleware } from './middleware/extract-user.middleware';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [UserModule, BlockModule, MongooseModule.forRoot(process.env.MONGODB_URL)],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractUserMiddleware)
      .forRoutes( { path: 'users/search', method: RequestMethod.GET },
        { path: 'block/:blockId', method: RequestMethod.POST },
        { path: 'block/unblock/:blockId', method: RequestMethod.POST });
  }
}
