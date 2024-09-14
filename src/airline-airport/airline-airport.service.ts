import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airline } from '../airline/entities/airline.entity';
import { Airport } from '../airport/entities/airport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}

  async addAirportToAirline(airlineId: string, airportId: string): Promise<Airline> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    const airport = await this.airportRepository.findOne({ where: { id: airportId } });
    if (!airline || !airport) {
      throw new NotFoundException('Airline or Airport not found');
    }
    airline.airports.push(airport);
    return this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string): Promise<Airport[]> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline) {
      throw new NotFoundException('Airline not found');
    }
    return airline.airports;
  }

  async findAirportFromAirline(airlineId: string, airportId: string): Promise<Airport> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline) {
      throw new NotFoundException('Airline not found');
    }
    const airport = airline.airports.find((airport) => airport.id === airportId);
    if (!airport) {
      throw new NotFoundException('Airport not found');
    }
    return airport;
  }

  async updateAirportsFromAirline(airlineId: string, airportIds: string[]): Promise<Airline> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline) {
      throw new NotFoundException('Airline not found');
    }
    const airports = await this.airportRepository.findByIds(airportIds);
    airline.airports = airports;
    return this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string): Promise<void> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline) {
      throw new NotFoundException('Airline not found');
    }
    airline.airports = airline.airports.filter((airport) => airport.id !== airportId);
    await this.airlineRepository.save(airline);
  }
  
}
