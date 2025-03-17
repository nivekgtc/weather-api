import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({
    example: '25.7°C',
    description: 'Formatted temperature with unit',
  })
  temp: string;

  @ApiProperty({ example: 'clear sky', description: 'Weather description' })
  description: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  city: string;

  static _OPENAPI_METADATA_FACTORY() {
    return {
      temp: { required: true, type: () => String, example: '25.7°C' },
      description: { required: true, type: () => String, example: 'clear sky' },
      city: { required: true, type: () => String, example: 'New York' },
    };
  }

  static examples = {
    arcoverde: {
      city: 'Arcoverde',
      description: 'light rain',
      temp: '30.51°C',
    },
    newYork: {
      city: 'New York',
      description: 'mist',
      temp: '13.31°C',
    },
  };

  static errorExamples = {
    cityNotFound: {
      statusCode: 404,
      timestamp: '2025-03-17T15:22:30.997Z',
      path: '/weather?city=',
      message: 'City not found.',
    },
    networkError: {
      statusCode: 503,
      timestamp: '2025-03-17T15:22:30.997Z',
      path: '/weather?city=New York',
      message: 'External API error.',
    },
  };
}
