import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExternalLibService } from '../external-lib/external-lib.service';
import { OPENWEATHER_OPTIONS } from './open-weather.constants';
import { OpenWeatherService } from './open-weather.service';

describe('OpenWeatherService', () => {
  let service: OpenWeatherService;
  let externalLibService: ExternalLibService;

  const mockOptions = {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.openweathermap.org',
  };

  const mockExternalLibService = {
    getData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenWeatherService,
        {
          provide: OPENWEATHER_OPTIONS,
          useValue: mockOptions,
        },
        {
          provide: ExternalLibService,
          useValue: mockExternalLibService,
        },
      ],
    }).compile();

    service = module.get<OpenWeatherService>(OpenWeatherService);
    externalLibService = module.get<ExternalLibService>(ExternalLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get city coordinates', async () => {
    const mockResponse = [{ lat: 40.7128, lon: -74.006 }];
    mockExternalLibService.getData.mockResolvedValue(mockResponse);

    const result = await service.getCityCoordinates('New York');

    expect(externalLibService.getData).toHaveBeenCalledWith(
      '/geo/1.0/direct?q=New York&limit=1',
    );
    expect(result).toEqual({ lat: 40.7128, lon: -74.006 });
  });

  it('should throw NotFoundException if city is not found', async () => {
    mockExternalLibService.getData.mockResolvedValue([]);

    await expect(service.getCityCoordinates('Unknown')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should get weather by coordinates', async () => {
    const mockResponse = {
      current: {
        temp: 25,
        weather: [{ description: 'clear sky' }],
      },
    };
    mockExternalLibService.getData.mockResolvedValue(mockResponse);

    const result = await service.getWeatherByCoordinates(
      40.7128,
      -74.006,
      'en',
    );

    expect(externalLibService.getData).toHaveBeenCalledWith(
      '/data/3.0/onecall?lat=40.7128&lon=-74.006&exclude=minutely,hourly,daily,alerts&units=metric&lang=en',
    );
    expect(result).toEqual({ temp: 25, description: 'clear sky' });
  });

  it('should get weather by city', async () => {
    const mockCoordinates = { lat: 40.7128, lon: -74.006 };
    const mockWeather = { temp: 25, description: 'clear sky' };

    jest
      .spyOn(service, 'getCityCoordinates')
      .mockResolvedValue(mockCoordinates);
    jest
      .spyOn(service, 'getWeatherByCoordinates')
      .mockResolvedValue(mockWeather);

    const result = await service.getWeatherByCity('New York', 'en');

    expect(service.getCityCoordinates).toHaveBeenCalledWith('New York');
    expect(service.getWeatherByCoordinates).toHaveBeenCalledWith(
      40.7128,
      -74.006,
      'en',
    );
    expect(result).toEqual(mockWeather);
  });
});
