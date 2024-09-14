import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Airport } from '../airport/entities/airport.entity';
import { Airline } from '../airline/entities/airline.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<Airline>;
  let airportRepository: Repository<Airport>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<Airline>>(
      getRepositoryToken(Airline),
    );
    airportRepository = module.get<Repository<Airport>>(
      getRepositoryToken(Airport),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add an airport to an airline', async () => {
    const airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      website: faker.internet.url()
    });
    const airport = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    const result = await service.addAirportToAirline(airline.id, airport.id);
    expect(result.airports).toContainEqual(expect.objectContaining({ id: airport.id }));
  });
  

  it('should find airports from an airline', async () => {
    const airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      website: faker.internet.url()
    });
    const airport1 = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    const airport2 = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await service.addAirportToAirline(airline.id, airport1.id);
    await service.addAirportToAirline(airline.id, airport2.id);
    const result = await service.findAirportsFromAirline(airline.id);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(expect.objectContaining({ id: airport1.id }));
    expect(result).toContainEqual(expect.objectContaining({ id: airport2.id }));
  });

  it('should find a specific airport from an airline', async () => {
    const airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      website: faker.internet.url()
    });
    const airport = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await service.addAirportToAirline(airline.id, airport.id);
    const result = await service.findAirportFromAirline(airline.id, airport.id);
    expect(result).toMatchObject({ id: airport.id });
  });

  it('should update airports from an airline', async () => {
    const airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      website: faker.internet.url()
    });
    const airport1 = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    const airport2 = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await service.addAirportToAirline(airline.id, airport1.id);
    const result = await service.updateAirportsFromAirline(airline.id, [airport2.id]);
    expect(result.airports).toHaveLength(1);
    expect(result.airports).toContainEqual(expect.objectContaining({ id: airport2.id }));
  });

  it('should delete an airport from an airline', async () => {
    const airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past(),
      website: faker.internet.url()
    });
    const airport = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await service.addAirportToAirline(airline.id, airport.id);
    await service.deleteAirportFromAirline(airline.id, airport.id);
    await expect(service.findAirportFromAirline(airline.id, airport.id)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if airline or airport does not exist when adding an airport', async () => {
    const validAirport = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await expect(service.addAirportToAirline('invalid-airline-id', validAirport.id)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if airline does not exist when finding airports', async () => {
    await expect(service.findAirportsFromAirline('invalid-airline-id')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if airline or airport does not exist when finding a specific airport', async () => {
    const validAirport = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await expect(service.findAirportFromAirline('invalid-airline-id', validAirport.id)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if airline does not exist when updating airports', async () => {
    const validAirport = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await expect(service.updateAirportsFromAirline('invalid-airline-id', [validAirport.id])).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if airline does not exist when deleting an airport', async () => {
    const validAirport = await airportRepository.save({
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await expect(service.deleteAirportFromAirline('invalid-airline-id', validAirport.id)).rejects.toThrow(NotFoundException);
  });
  
});
