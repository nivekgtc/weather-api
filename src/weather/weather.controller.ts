/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'city',
    required: true,
    description: 'Name of the city to get weather information for',
    examples: WeatherQueryDto.examples,
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: WeatherResponseDto,
    example: WeatherResponseDto.examples.arcoverde,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: WeatherResponseDto.errorExamples.cityNotFound,
  })
  @ApiResponse({
    status: 503,
    description: 'Service Unavailable',
    example: WeatherResponseDto.errorExamples.networkError,
  })
  async getWeatherByCity(
    @Query() query: WeatherQueryDto,
    @I18nLang() lang: string,
  ): Promise<WeatherResponseDto> {
    try {
      const { city } = query;

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
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;

        throw new HttpException({ message }, status);
      } else if (error.request) {
        throw new HttpException(
          { message: 'errors.NETWORK_ERROR' },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        throw new HttpException(
          { message: 'errors.UNKNOWN_ERROR' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
