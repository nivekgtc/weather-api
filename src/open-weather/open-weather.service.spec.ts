import { Test, TestingModule } from '@nestjs/testing';
import { OpenWeatherService } from './open-weather.service';
import { OPENWEATHER_OPTIONS } from './open-weather.constants';

describe('OpenWeatherService', () => {
  let service: OpenWeatherService;

  const mockOptions = {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.openweathermap.org',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenWeatherService,
        {
          provide: OPENWEATHER_OPTIONS,
          useValue: mockOptions,
        },
      ],
    }).compile();

    service = module.get<OpenWeatherService>(OpenWeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
