import { Controller, Post, Body } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';

@Controller('spaces')
export class SpacesController {

    @Post()
    async create(@Body() createSpaceDto: CreateSpaceDto) {
        return{};
    }
}
