import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExternalLibModule } from 'src/external-lib/external-lib.module';
import { OPENWEATHER_OPTIONS } from './open-weather.constants';
import { OpenWeatherService } from './open-weather.service';

@Module({
  imports: [
    ConfigModule,
    ExternalLibModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('OPENWEATHER_API_KEY'),
        baseUrl: configService.get<string>(
          'OPENWEATHER_BASE_URL',
          'https://api.openweathermap.org',
        ),
        tokenType: 'params',
      }),
    }),
  ],
  providers: [
    {
      provide: OPENWEATHER_OPTIONS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('OPENWEATHER_API_KEY'),
        baseUrl: configService.get<string>(
          'OPENWEATHER_BASE_URL',
          'https://api.openweathermap.org',
        ),
        tokenType: 'params',
      }),
    },
    OpenWeatherService,
  ],
  exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
