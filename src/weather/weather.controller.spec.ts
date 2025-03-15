import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import { BadRequestException } from '@nestjs/common';

describe('WeatherController', () => {
  let controller: WeatherController;
  let openWeatherService: OpenWeatherService;

  const mockOpenWeatherService = {
    getWeatherByCity: jest.fn(),
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
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    openWeatherService = module.get<OpenWeatherService>(OpenWeatherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return formatted weather data for a city', async () => {
    const mockWeatherData = { temp: 25, description: 'clear sky' };
    mockOpenWeatherService.getWeatherByCity.mockResolvedValue(mockWeatherData);

    const result = await controller.getWeatherByCity('São Paulo');

    expect(openWeatherService.getWeatherByCity).toHaveBeenCalledWith('São Paulo');

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

  it('should throw a BadRequestException when city is not provided', async () => {
    await expect(controller.getWeatherByCity('')).rejects.toThrow(BadRequestException);
    await expect(controller.getWeatherByCity('')).rejects.toThrowError('City not informed.');

    expect(openWeatherService.getWeatherByCity).not.toHaveBeenCalled();
  });
});
