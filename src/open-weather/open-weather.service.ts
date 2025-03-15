import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { OPENWEATHER_OPTIONS } from './open-weather.constants';
import { OpenWeatherOptions } from './open-weather.options';

@Injectable()
export class OpenWeatherService {
  private axiosInstance: AxiosInstance;

  constructor(@Inject(OPENWEATHER_OPTIONS) private options: OpenWeatherOptions) {
    this.axiosInstance = axios.create({
      baseURL: options.baseUrl,
      params: {
        appid: options.apiKey, units: 'metric', lang: 'pt'
      },
    })
  }

  /**
   * Gets the coordinates (latitude, longitude) of the city
  */
  async getCityCoordinates(city: string): Promise<{ lat: number; lon: number }> {
    const response = await this.axiosInstance.get('/geo/1.0/direct', {
      params: { q: city, limit: 1 },

    });

    if (!response.data.length) {
      throw new Error('City not found.');
    }

    return { lat: response.data[0].lat, lon: response.data[0].lon };
  }

  /**
   * Gets the current temperature based on latitude and longitude
   */
  async getWeatherByCoordinates(lat: number, lon: number, lang: string): Promise<{ temp: number; description: string }> {
    const response = await this.axiosInstance.get('/data/3.0/onecall', {
      params: { lat, lon, exclude: 'minutely,hourly,daily,alerts', units: 'metric', lang: lang || 'en' },
    });

    return {
      temp: response.data.current.temp,
      description: response.data.current.weather[0].description,
    };
  }

  /**
   * Gets the current temperature by city name (making two API calls)
   */
  async getWeatherByCity(city: string, lang: string): Promise<{ temp: number; description: string }> {
    const { lat, lon } = await this.getCityCoordinates(city);
    return this.getWeatherByCoordinates(lat, lon, lang);
  }
}
