import { Controller, Get, Post, Put, Delete, Param, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<void> {
    try {
      const user = await this.userService.create(createUserDto);
      res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response): Promise<void> {
    try {
      const users = await this.userService.findAll();
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: users,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response): Promise<void> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      res.status(error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.userService.delete(id);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  @Get('search')
  async searchUsers(@Req() req, @Res() res: Response): Promise<void> {
    const { username, minAge, maxAge } = req.query;
    try {
      console.log("userId", req.user);
      const userId = req.user.sub;
      const users = await this.userService.searchUsers(userId, username as string, minAge ? parseInt(minAge as string) : undefined, maxAge ? parseInt(maxAge as string) : undefined);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: users,
      });
    } catch (error) {
      res.status(error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: error.getStatus ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}