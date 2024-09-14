import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}

  async findAll(): Promise<Airport[]> {
    return this.airportRepository.find();
  }

  async findOne(id: string): Promise<Airport> {
    const airport = await this.airportRepository.findOne({ where: { id }});
    if (!airport) throw new NotFoundException(`Airport with ID ${id} not found`);
    return airport;
  }

  async create(createAirportDto: CreateAirportDto): Promise<Airport> {
    const { code } = createAirportDto;
    if (code.length !== 3) {
      throw new BadRequestException('The airport code must be exactly 3 characters');
    }
    const airport = this.airportRepository.create(createAirportDto);
    return this.airportRepository.save(airport);
  }

  async update(id: string, updateAirportDto: UpdateAirportDto): Promise<Airport> {
    const { code } = updateAirportDto;
    if (code && code.length !== 3) {
      throw new BadRequestException('The airport code must be exactly 3 characters');
    }
    const airport = await this.airportRepository.preload({ id, ...updateAirportDto });
    if (!airport) throw new NotFoundException(`Airport with ID ${id} not found`);
    return this.airportRepository.save(airport);
  }

  async delete(id: string): Promise<void> {
    const airport = await this.findOne(id);
    await this.airportRepository.remove(airport);
  }
  
}
