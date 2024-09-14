import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Airline } from './entities/airline.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<Airline>;
  let airlineList: Airline[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<Airline>>(getRepositoryToken(Airline));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    airlineList = [];
    for (let i = 0; i < 5; i++) {
      const airline: Airline = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past({years:1}), 
        website: faker.internet.url(),
      });
      airlineList.push(airline);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all airlines', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(airlineList.length);

    result.forEach((airline, index) => {
      expect(airline).toMatchObject({
        id: airlineList[index].id,
        name: airlineList[index].name,
        description: airlineList[index].description,
        foundationDate: airlineList[index].foundationDate,
        website: airlineList[index].website,
      });
    });
  });

  it('should return an airline by id', async () => {
    const result = await service.findOne(airlineList[0].id);
    expect(result).toMatchObject({
      id: airlineList[0].id,
      name: airlineList[0].name,
      description: airlineList[0].description,
      foundationDate: airlineList[0].foundationDate,
      website: airlineList[0].website,
    });
  });

  it('should throw NotFoundException for an invalid id', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should create a new airline', async () => {
    const createDto = {
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past({years:1}),
      website: faker.internet.url(),
    };

    const result = await service.create(createDto);
    expect(result).toMatchObject(createDto);
  });

  it('should throw BadRequestException for future foundation date during create', async () => {
    const createDto = {
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.future({years:1}),
      website: faker.internet.url(),
    };

    await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
  });

  it('should update an airline', async () => {
    const updateDto = {
      name: 'Updated Airline',
      description: 'Updated description',
      foundationDate: faker.date.past({years:1}),
      website: 'https://updated-website.com',
    };

    const result = await service.update(airlineList[0].id, updateDto);
    expect(result).toMatchObject({
      id: airlineList[0].id,
      ...updateDto,
    });
  });

  it('should throw NotFoundException for an invalid id during update', async () => {
    const updateDto = {
      name: 'Updated Airline',
      description: 'Updated description',
      foundationDate: faker.date.past({years:1}),
      website: 'https://updated-website.com',
    };

    await expect(service.update('invalid-id', updateDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException for future foundation date during update', async () => {
    const updateDto = {
      name: 'Updated Airline',
      description: 'Updated description',
      foundationDate: faker.date.future({years:1}),
      website: 'https://updated-website.com',
    };

    await expect(service.update(airlineList[0].id, updateDto)).rejects.toThrow(BadRequestException);
  });

  it('should remove an airline', async () => {
    const id = airlineList[0].id;
    await service.remove(id);
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException for an invalid id during remove', async () => {
    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
