import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from './airline/entities/airline.entity';
import { Airport } from './airport/entities/airport.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'airline_coverage',
      entities: [
        Airline,
        Airport
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AirlineModule,
    AirportModule,
    AirlineAirportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
