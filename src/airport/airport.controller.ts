import { Controller, Get, Post, Param, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { AirportService } from './airport.service';
import { Airport } from './entities/airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';

@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  async findAll(): Promise<Airport[]> {
    return await this.airportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Airport> {
    return await this.airportService.findOne(id);
  }

  @Post()
  async create(@Body() createAirportDto: CreateAirportDto): Promise<Airport> {
    return await this.airportService.create(createAirportDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAirportDto: UpdateAirportDto,
  ): Promise<Airport> {
    return await this.airportService.update(id, updateAirportDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.airportService.delete(id);
  }
  
}
