import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @ApiProperty({
    example: 'New York',
    description: 'Name of the city to get weather information for',
  })
  city: string;

  static examples = {
    arcoverde: {
      summary: 'Arcoverde',
      value: 'Arcoverde',
    },
    newYork: {
      summary: 'New York',
      value: 'New York',
    },
  };
}
