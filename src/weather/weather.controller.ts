import { Controller, Get, Query } from '@nestjs/common';
import { OpenWeatherService } from 'src/open-weather/open-weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly openWeatherService: OpenWeatherService) { }

  @Get()
  async getWeatherByCity(@Query('city') city: string) {
    if (!city) {
      return { error: 'Cidade não informada.' };
    }

    const { description, temp } = await this.openWeatherService.getWeatherByCity(city);

    const weather = {
      city,
      description,
      temp: new Intl.NumberFormat('pt-BR', {
        style: 'unit',
        unit: 'celsius',
        unitDisplay: 'short',
      }).format(temp),
    }

    return weather;
  }
}
