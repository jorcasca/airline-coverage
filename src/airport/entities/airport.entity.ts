import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Airline } from '../../airline/entities/airline.entity';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 3 })
  code: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @ManyToMany(() => Airline, airline => airline.airports)
  airlines: Airline[];
}
