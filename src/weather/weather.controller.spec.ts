import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { OpenWeatherService } from '../open-weather/open-weather.service';

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

  it('should return weather data for a city', async () => {
    const mockWeatherData = { temp: 25, description: 'clear sky' };
    mockOpenWeatherService.getWeatherByCity.mockResolvedValue(mockWeatherData);

    const result = await controller.getWeatherByCity('São Paulo');

    expect(openWeatherService.getWeatherByCity).toHaveBeenCalledWith('São Paulo');
    expect(result).toEqual(mockWeatherData);
  });

  it('should return an error message when city is not provided', async () => {
    const result = await controller.getWeatherByCity('');

    expect(result).toEqual({ error: 'Cidade não informada.' });
    expect(openWeatherService.getWeatherByCity).not.toHaveBeenCalled();
  });
});
