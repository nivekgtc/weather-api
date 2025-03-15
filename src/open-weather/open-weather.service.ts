import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExternalLibService } from '../external-lib/external-lib.service';
import { OPENWEATHER_OPTIONS } from './open-weather.constants';
import { OpenWeatherOptions } from './open-weather.options';

@Injectable()
export class OpenWeatherService {
  constructor(
    @Inject(OPENWEATHER_OPTIONS) private options: OpenWeatherOptions,
    private readonly externalLibService: ExternalLibService,
  ) {}

  /**
   * Gets the coordinates (latitude, longitude) of the city
   */
  async getCityCoordinates(
    city: string,
  ): Promise<{ lat: number; lon: number }> {
    const response = await this.externalLibService.getData(
      '/geo/1.0/direct?q=' + city + '&limit=1',
    );

    if (!response.length) {
      throw new NotFoundException({
        message: 'errors.CITY_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return { lat: response[0].lat, lon: response[0].lon };
  }

  /**
   * Gets the current temperature based on latitude and longitude
   */
  async getWeatherByCoordinates(
    lat: number,
    lon: number,
    lang: string,
  ): Promise<{ temp: number; description: string }> {
    const response = await this.externalLibService.getData(
      `/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&lang=${lang || 'en'}`,
    );

    return {
      temp: response.current.temp,
      description: response.current.weather[0].description,
    };
  }

  /**
   * Gets the current temperature by city name (making two API calls)
   */
  async getWeatherByCity(
    city: string,
    lang: string,
  ): Promise<{ temp: number; description: string }> {
    const { lat, lon } = await this.getCityCoordinates(city);
    return this.getWeatherByCoordinates(lat, lon, lang);
  }
}
