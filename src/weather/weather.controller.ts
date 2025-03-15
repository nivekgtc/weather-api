import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpenWeatherService } from 'src/open-weather/open-weather.service';
import { WeatherResponseDto } from './dto/weather.response.dto';

@Controller('weather')
@ApiTags("Weather")
export class WeatherController {
  constructor(private readonly openWeatherService: OpenWeatherService) { }

  @Get()
  async getWeatherByCity(@Query('city') city: string): Promise<WeatherResponseDto> {
    if (!city) {
      throw new BadRequestException({
        message: 'Cidade não informada.',
        code: 'CITY_REQUIRED',
      })
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
