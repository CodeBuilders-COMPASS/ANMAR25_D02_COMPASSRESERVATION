import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
    async findAll() {
        return {spaces:[]};
    }
    @Get(':id')
    async findOne(@Param() params) {
        return {space:[], params};
    }
}
