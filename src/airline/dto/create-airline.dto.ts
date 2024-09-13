import { IsString, IsNotEmpty, IsDate, IsUrl, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAirlineDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDate()
    @Type(() => Date)
    foundationDate: Date;

    @IsUrl()
    @IsOptional()
    website?: string;
}
