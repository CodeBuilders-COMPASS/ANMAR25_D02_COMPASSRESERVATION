import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { FilterSpaceDto } from './dto/filter-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
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
          
      async findAll(filterDto: FilterSpaceDto): Promise<{ data: Space[]; total: number }> {
        let filtered = [...this.spaces];
      
        if (filterDto.name !== undefined) {
          filtered = filtered.filter(space => 
            space.name.toLowerCase().includes(filterDto.name!.toLowerCase())
          );
        }
      
        if (filterDto.capacity !== undefined) {
            const capacity = filterDto.capacity;
            filtered = filtered.filter(space => space.capacity >= capacity);
          }
      
        if (filterDto.status !== undefined) {
          filtered = filtered.filter(space => space.status === filterDto.status);
        }
      
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;
      
        return {
          data: filtered.slice(start, end),
          total: filtered.length,
        };
      }
    
      async findOne(id: number): Promise<Space> {
        const space = this.spaces.find(space => space.id === id);
        if (!space) {
          throw new NotFoundException(`Space with ID ${id} not found.`);
        }
        return space;
      }
      async update(id: number, updateDto: UpdateSpaceDto): Promise<Space> {
        const space = await this.findOne(id);
    
        if (updateDto.name && updateDto.name !== space.name) {
          const nameExists = this.spaces.some(s => s.name === updateDto.name && s.id !== id);
          if (nameExists) {
            throw new BadRequestException('Space with this name already exists.');
          }
          space.name = updateDto.name;
        }
    
        if (updateDto.description !== undefined) {
          space.description = updateDto.description;
        }
    
        if (updateDto.capacity !== undefined) {
          space.capacity = updateDto.capacity;
        }
    
        space.updatedAt = new Date();
        return space;
      }
    
      async remove(id: number): Promise<Space> {
        const space = await this.findOne(id);
        space.status = 'INACTIVE';
        space.updatedAt = new Date();
        return space;
      }
}