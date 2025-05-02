import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { JwtAuthGuard } from '../auth/jwt.guard';
import { ParamId } from '../decorators/param-id.decorator';


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
  findOne(@ParamId('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@ParamId('id') id: number, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  remove(@ParamId('id') id: number) {
    return this.usersService.remove(id);
  }
}
