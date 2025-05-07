import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { UserExistsPipe } from '../pipes/user-exists.pipe';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterUserDto) {
    return this.usersService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', PositiveIntPipe, UserExistsPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', PositiveIntPipe, UserExistsPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', PositiveIntPipe, UserExistsPipe) id: number) {
    return this.usersService.remove(id);
  }
}
