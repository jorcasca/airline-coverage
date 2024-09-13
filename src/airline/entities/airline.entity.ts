import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Airport } from '../../airport/entities/airport.entity';

@Entity()
export class Airline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  foundationDate: Date;

  @Column()
  website: string;

  @ManyToMany(() => Airport, airport => airport.airlines)
  @JoinTable()
  airports: Airport[];
}
