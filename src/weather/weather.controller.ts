import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpenWeatherService } from 'src/open-weather/open-weather.service';
import { WeatherResponseDto } from './dto/weather.response.dto';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Controller('weather')
@ApiTags("Weather")
export class WeatherController {
  constructor(private readonly openWeatherService: OpenWeatherService,
    private readonly i18n: I18nService
  ) { }

  @Get()
  async getWeatherByCity(@Query('city') city: string, @I18nLang() lang: string): Promise<WeatherResponseDto> {
    if (!city) {
      throw new BadRequestException({
        message: this.i18n.translate('error.city_not_found', { lang }),
        code: 'CITY_REQUIRED',
      })
    }

    const { description, temp } = await this.openWeatherService.getWeatherByCity(city, lang);

    const weather = {
      city,
      description,
      temp: new Intl.NumberFormat(lang || 'en', {
        style: 'unit',
        unit: 'celsius',
        unitDisplay: 'short',
      }).format(temp),
    }

    return weather;
  }
}
