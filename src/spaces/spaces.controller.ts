import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';

@Controller('spaces')
export class SpacesController {

    @Post()
    async create(@Body() createSpaceDto: CreateSpaceDto) {
        return{};
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
