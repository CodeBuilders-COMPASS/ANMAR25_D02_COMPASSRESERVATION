import { Controller, Post, Body, Get, Param, Query, Delete, Patch, UsePipes, UseGuards } from '@nestjs/common';
import { FilterSpaceDto } from './dto/filter-space.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { SpacesService } from './spaces.service';
import { PositiveIntPipe } from 'src/pipes/positive-int.pipe';
import { SpaceExistsPipe } from 'src/pipes/space-exists.pipe';
import { ResourcesValidationExistPipe } from 'src/pipes/validate-resources-exist.pipe';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('spaces')
@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpacesController {
    constructor(private readonly spacesService: SpacesService) {}

    @Post()
    @UsePipes( ResourcesValidationExistPipe )
    async create(@Body() createSpaceDto: CreateSpaceDto) {
        return this.spacesService.create(createSpaceDto);
    }
    @Get()
    findAll(@Query() filterDto: FilterSpaceDto) {
      return this.spacesService.findAll(filterDto);
    }
  
    @Get(':id')
    findOne(@Param('id', PositiveIntPipe, SpaceExistsPipe) id: number) {
      return this.spacesService.findOne(id);
    }
    @Patch(':id')
    @UsePipes( ResourcesValidationExistPipe )
    update(
      @Param('id', PositiveIntPipe, SpaceExistsPipe) id: number, 
      @Body() updateSpaceDto: UpdateSpaceDto
    ) {
      return this.spacesService.update(id, updateSpaceDto);
    }
    @Delete(':id/deactivate')
    async deactivate(@Param('id', PositiveIntPipe, SpaceExistsPipe) id: number) {
      return this.spacesService.remove(id); 
    }
}


