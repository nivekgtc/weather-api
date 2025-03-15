import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;
}
