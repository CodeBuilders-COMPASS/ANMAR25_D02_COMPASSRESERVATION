import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { Space } from './entities/space.entity';

@Injectable()
export class SpacesService {
    private spaces: Space[] = [
        {
            id: 1,
            name: 'Conference Room A',
            description: 'A large conference room with a projector.',
            capacity: 20,
            status: 'ACTIVE',
            createdAt: new Date(),
        },
        {
            id: 2,
            name: 'Meeting Room B',
            description: 'A small meeting room for team discussions.',
            capacity: 10,
            status: 'ACTIVE',
            createdAt: new Date(),
        },
    ];
    async create(createSpaceDto: CreateSpaceDto): Promise<Space> {
        const nameExists = this.spaces.some(space => space.name === createSpaceDto.name);
        if (nameExists) {
          throw new BadRequestException('Space with this name already exists.');
        }
    
        const newSpace: Space = {
          id: this.spaces.length + 1,
          ...createSpaceDto,
          status: 'ACTIVE',
          createdAt: new Date(),
        };
    
        this.spaces.push(newSpace);
        return newSpace;
      }
}