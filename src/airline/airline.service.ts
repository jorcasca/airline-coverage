import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airline } from './entities/airline.entity';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
  ) {}

  async findAll(): Promise<Airline[]> {
    return this.airlineRepository.find();
  }

  async findOne(id: string): Promise<Airline> {
    const airline = await this.airlineRepository.findOne({ where: { id } });
    if (!airline) throw new NotFoundException(`Airline with ID ${id} not found`);
    return airline;
  }

  async create(createAirlineDto: CreateAirlineDto): Promise<Airline> {
    const { foundationDate } = createAirlineDto;
    if (new Date(foundationDate) > new Date()) {
      throw new BadRequestException('The foundation date must be in the past');
    }
    const airline = this.airlineRepository.create(createAirlineDto);
    return this.airlineRepository.save(airline);
  }

  async update(id: string, updateAirlineDto: UpdateAirlineDto): Promise<Airline> {
    const { foundationDate } = updateAirlineDto;
    if (foundationDate && new Date(foundationDate) > new Date()) {
      throw new BadRequestException('The foundation date must be in the past');
    }
    const airline = await this.airlineRepository.preload({ id, ...updateAirlineDto });
    if (!airline) throw new NotFoundException(`Airline with ID ${id} not found`);
    return this.airlineRepository.save(airline);
  }

  async remove(id: string): Promise<void> {
    const airline = await this.findOne(id);
    await this.airlineRepository.delete(airline);
  }
  
}
