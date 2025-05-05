import { Controller, Post, Body, Get, Param, Query, Delete, Patch, UseGuards } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FilterResourceDto } from './dto/filter-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PositiveIntPipe } from 'src/pipes/positive-int.pipe';
import { ResourceExistsPipe } from 'src/pipes/resource-exists.pipe';
import { JwtAuthGuard } from 'src/guards/jwt.guard';


@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourceController {
    constructor(private readonly resourceService: ResourceService) { }

    @Post()
    async create(@Body() createResourceDto: CreateResourceDto) {
        return this.resourceService.create(createResourceDto);
    }
    @Get()
    findAll(@Query() filterDto: FilterResourceDto) {
        return this.resourceService.findAll(filterDto);
    }

    @Get(':id')
    findOne(@Param('id', PositiveIntPipe, ResourceExistsPipe) id: number) {
        return this.resourceService.findOne(id);
    }
    @Patch(':id')
    update(
      @Param('id', PositiveIntPipe, ResourceExistsPipe) id: number, 
      @Body() updateResourceDto: UpdateResourceDto
    ) {
        return this.resourceService.update(id, updateResourceDto);
    }
    @Delete(':id/deactivate')
    async deactivate(@Param('id', PositiveIntPipe, ResourceExistsPipe) id: number) {
        return this.resourceService.remove(id);
    }

}
