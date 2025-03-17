import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { I18nService } from 'nestjs-i18n';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import { WeatherController } from './weather.controller';

describe('WeatherController', () => {
  let controller: WeatherController;
  let openWeatherService: OpenWeatherService;
  let cacheManager: Cache;

  const mockOpenWeatherService = {
    getWeatherByCity: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockI18nService = {
    translate: jest.fn((key) => key),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: OpenWeatherService,
          useValue: mockOpenWeatherService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    openWeatherService = module.get<OpenWeatherService>(OpenWeatherService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return formatted weather data for a city', async () => {
    const mockWeatherData = { temp: 25, description: 'clear sky' };
    mockOpenWeatherService.getWeatherByCity.mockResolvedValue(mockWeatherData);

    const result = await controller.getWeatherByCity(
      { city: 'São Paulo' },
      'pt-BR',
    );

    expect(openWeatherService.getWeatherByCity).toHaveBeenCalledWith(
      'São Paulo',
      'pt-BR',
    );

    expect(result).toEqual({
      city: 'São Paulo',
      description: 'clear sky',
      temp: new Intl.NumberFormat('pt-BR', {
        style: 'unit',
        unit: 'celsius',
        unitDisplay: 'short',
      }).format(25),
    });
  });

  it('should return cached weather data if available', async () => {
    const mockCachedData = { temp: 30, description: 'sunny', city: 'Recife' };
    mockCacheManager.get.mockResolvedValue(mockCachedData);

    const result = await controller.getWeatherByCity(
      { city: 'Recife' },
      'pt-BR',
    );

    expect(cacheManager.get).toHaveBeenCalledWith('Recife');
    expect(openWeatherService.getWeatherByCity).not.toHaveBeenCalled();
    expect(result).toEqual({
      city: 'Recife',
      description: 'sunny',
      temp: new Intl.NumberFormat('pt-BR', {
        style: 'unit',
        unit: 'celsius',
        unitDisplay: 'short',
      }).format(30),
    });
  });

  it('should handle NotFoundException from OpenWeatherService', async () => {
    mockOpenWeatherService.getWeatherByCity.mockRejectedValue(
      new NotFoundException(),
    );

    await expect(
      controller.getWeatherByCity({ city: 'Unknown' }, 'pt-BR'),
    ).rejects.toThrow(NotFoundException);

    expect(openWeatherService.getWeatherByCity).toHaveBeenCalledWith(
      'Unknown',
      'pt-BR',
    );
  });

  it('should handle HttpException from OpenWeatherService', async () => {
    const mockError = {
      response: {
        status: 503,
        data: { message: 'Service Unavailable' },
      },
    };
    mockOpenWeatherService.getWeatherByCity.mockRejectedValue(mockError);

    await expect(
      controller.getWeatherByCity({ city: 'New York' }, 'en'),
    ).rejects.toThrow(HttpException);

    expect(openWeatherService.getWeatherByCity).toHaveBeenCalledWith(
      'New York',
      'en',
    );
  });
});
