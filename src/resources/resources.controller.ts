import { Controller, Post, Body, Get, Param, Query, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { ResourceService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FilterResourceDto } from './dto/filter-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';


@Controller('resources')
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
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.resourceService.findOne(id);
    }
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateResourceDto: UpdateResourceDto) {
        return this.resourceService.update(id, updateResourceDto);
    }
    @Delete(':id/deactivate')
    async deactivate(@Param('id', ParseIntPipe) id: number) {
        return this.resourceService.remove(+id);
    }

}
