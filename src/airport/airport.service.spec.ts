import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<Airport>;
  let airportList: Airport[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<Airport>>(
      getRepositoryToken(Airport),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    airportList = [];
    for (let i = 0; i < 5; i++) {
      const airport: Airport = await repository.save({
        name: faker.company.name(),
        code: faker.string.alpha({ length: 3 }).toUpperCase(),
        country: faker.location.country(),
        city: faker.location.city(),
      });
      airportList.push(airport);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all airports', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(airportList.length);

    result.forEach((airport, index) => {
      expect(airport).toMatchObject({
        id: airportList[index].id,
        name: airportList[index].name,
        code: airportList[index].code,
        country: airportList[index].country,
        city: airportList[index].city,
      });
    });
  });

  it('should return an airport by id', async () => {
    const result = await service.findOne(airportList[0].id);
    expect(result).toMatchObject({
      id: airportList[0].id,
      name: airportList[0].name,
      code: airportList[0].code,
      country: airportList[0].country,
      city: airportList[0].city,
    });
  });

  it('should create a new airport', async () => {
    const createDto = {
      name: faker.company.name(),
      code: faker.string.alpha({ length: 3 }).toUpperCase(),
      country: faker.location.country(),
      city: faker.location.city(),
    };

    const result = await service.create(createDto);
    expect(result).toMatchObject(createDto);
  });

  it('should update an airport', async () => {
    const updateDto = {
      name: 'Updated Name',
      code: 'UPD',
      country: 'Updated Country',
      city: 'Updated City',
    };

    const result = await service.update(airportList[0].id, updateDto);
    expect(result).toMatchObject({
      id: airportList[0].id,
      ...updateDto,
    });
  });

  it('should throw NotFoundException for an invalid id', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException for invalid airport code during create', async () => {
    const createDto = {
      name: faker.company.name(),
      code: 'INVALID',
      country: faker.location.country(),
      city: faker.location.city(),
    };
    await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException for an invalid id during update', async () => {
    const updateDto = {
      name: 'Updated Name',
      code: 'UPD',
      country: 'Updated Country',
      city: 'Updated City',
    };
    await expect(service.update('invalid-id', updateDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException for invalid airport code during update', async () => {
    const updateDto = {
      name: 'Updated Name',
      code: 'INVALID',
      country: 'Updated Country',
      city: 'Updated City',
    };
    await expect(service.update(airportList[0].id, updateDto)).rejects.toThrow(BadRequestException);
  });

});
