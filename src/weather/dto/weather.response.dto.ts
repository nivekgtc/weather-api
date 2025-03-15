import { ApiProperty } from "@nestjs/swagger";

export class WeatherResponseDto {

  @ApiProperty({ example: '25.7°C', description: 'Formatted temperature with unit' })
  temp: string;

  @ApiProperty({ example: 'clear sky', description: 'Weather description' })
  description: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  city: string;
}