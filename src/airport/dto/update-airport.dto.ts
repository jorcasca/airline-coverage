import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateAirportDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @Length(3, 3)
    @IsNotEmpty()
    code: string;
  
    @IsString()
    @IsNotEmpty()
    country: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
}
