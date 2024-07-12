import { Controller, Post, Param, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { BlockService } from './block.service';
import { Response } from 'express';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post(':blockId')
  async blockUser(@Req() req, @Param('blockId') blockId: string, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.sub;
      await this.blockService.blockUser(userId, blockId);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'User blocked successfully',
      });
    } catch (error) {
      res.status(error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Post('unblock/:blockId')
  async unblockUser(@Req() req, @Param('blockId') blockId: string, @Res() res: Response): Promise<void> {
    try {
      const userId = req.user.sub;
      await this.blockService.unblockUser(userId, blockId);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'User unblocked successfully',
      });
    } catch (error) {
      res.status(error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}
