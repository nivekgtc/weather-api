import { DynamicModule, Module } from '@nestjs/common';
import { OpenWeatherService } from './open-weather.service';
import { OPENWEATHER_OPTIONS } from './open-weather.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class OpenWeatherModule {
  static forRoot(): DynamicModule {
    return {
      module: OpenWeatherModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: OPENWEATHER_OPTIONS,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            apiKey: configService.get<string>('OPENWEATHER_API_KEY'),
            baseUrl: configService.get<string>('OPENWEATHER_BASE_URL', 'https://api.openweathermap.org'),
          }),
        },
        OpenWeatherService,
      ],
      exports: [OpenWeatherService],
    };
  }
}

