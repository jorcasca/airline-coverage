import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';

@Controller('airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  async findAll() {
    return await this.airlineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.airlineService.findOne(id);
  }

  @Post()
  async create(@Body() createAirlineDto: CreateAirlineDto) {
    return await this.airlineService.create(createAirlineDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAirlineDto: UpdateAirlineDto) {
    return await this.airlineService.update(id, updateAirlineDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.airlineService.remove(id);
  }
  
}
