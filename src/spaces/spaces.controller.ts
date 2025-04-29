import { Controller, Post, Body, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { FilterSpaceDto } from './dto/filter-space.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpacesService } from './spaces.service';

@Controller('spaces')
export class SpacesController {
    constructor(private readonly spacesService: SpacesService) {}

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
}
