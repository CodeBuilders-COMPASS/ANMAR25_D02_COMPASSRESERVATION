import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { FilterSpaceDto } from './dto/filter-space.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { SpacesService } from './spaces.service';
import { ParamId } from '../decorators/param-id.decorator';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

<<<<<<< HEAD
  @Post()
  async create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spacesService.create(createSpaceDto);
  }
  @Get()
  findAll(@Query() filterDto: FilterSpaceDto) {
    return this.spacesService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spacesService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }
  @Delete(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.spacesService.remove(+id); // this sets status to INACTIVE
  }
=======
    @Post()
    async create(@Body() createSpaceDto: CreateSpaceDto) {
        return this.spacesService.create(createSpaceDto);
    }
    @Get()
    findAll(@Query() filterDto: FilterSpaceDto) {
      return this.spacesService.findAll(filterDto);
    }
  
    @Get(':id')
    findOne(@ParamId() id: number) {
      return this.spacesService.findOne(id);
    }
    @Patch(':id')
    update(@ParamId() id: number, @Body() updateSpaceDto: UpdateSpaceDto) {
      return this.spacesService.update(id, updateSpaceDto);
    }
    @Delete(':id/deactivate')
    async deactivate(@ParamId() id: number) {
      return this.spacesService.remove(+id); 
    }
  
>>>>>>> develop
}
