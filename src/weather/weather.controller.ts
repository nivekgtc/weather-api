import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { OpenWeatherService } from 'src/open-weather/open-weather.service';
import { WeatherQueryDto } from './dto/weather.query.dto';
import { WeatherResponseDto } from './dto/weather.response.dto';

@Controller('weather')
@ApiTags('Weather')
export class WeatherController {
  constructor(
    private readonly openWeatherService: OpenWeatherService,
    private readonly i18n: I18nService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getWeatherByCity(
    @Query() query: WeatherQueryDto,
    @I18nLang() lang: string,
  ): Promise<WeatherResponseDto> {
    const { city } = query;

    if (!city) {
      throw new BadRequestException({
        message: this.i18n.translate('error.city_not_found', { lang }),
        code: 'CITY_REQUIRED',
      });
    }

    const hasCache = await this.cacheManager.get<{
      temp: number;
      description: string;
      city: string;
    }>(city);
    if (hasCache) {
      const { temp, description } = hasCache;
      const weather = {
        city,
        description,
        temp: new Intl.NumberFormat(lang || 'en', {
          style: 'unit',
          unit: 'celsius',
          unitDisplay: 'short',
        }).format(temp),
      };

      return weather;
    }

    const { description, temp } =
      await this.openWeatherService.getWeatherByCity(city, lang);

    const weather = {
      city,
      description,
      temp: new Intl.NumberFormat(lang || 'en', {
        style: 'unit',
        unit: 'celsius',
        unitDisplay: 'short',
      }).format(temp),
    };

    await this.cacheManager.set(city, { temp, description, city }, 6 * 1000);

    return weather;
  }
}
