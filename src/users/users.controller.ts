import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { JwtAuthGuard } from '../auth/jwt.guard';
import { PositiveIntPipe } from 'src/pipes/positive-int.pipe';
import { UserExistsPipe } from 'src/pipes/user-exists.pipe';



@Controller('users')
//@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get()
  findAll(@Query() query) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', PositiveIntPipe, UserExistsPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', PositiveIntPipe, UserExistsPipe) id: number, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', PositiveIntPipe, UserExistsPipe) id: number) {
    return this.usersService.remove(id);
  }
}
