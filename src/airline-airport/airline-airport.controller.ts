import { Controller, Post, Get, Delete, Param, HttpCode, Body, Put } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { Airport } from '../airport/entities/airport.entity';

@Controller('airlines')
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airlineId/airports/:airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.addAirportToAirline(airlineId, airportId);
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string): Promise<Airport[]> {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ): Promise<Airport> {
    return await this.airlineAirportService.findAirportFromAirline(airlineId, airportId);
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body('airportIds') airportId: string[],
  ) {
    return await this.airlineAirportService.updateAirportsFromAirline(airlineId, airportId);
  }

  @Delete(':airlineId/airports/:airportId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.deleteAirportFromAirline(airlineId, airportId);
  }
  
}
