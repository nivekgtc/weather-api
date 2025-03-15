import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all-exception-filter';
import { OpenWeatherModule } from './open-weather/open-weather.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: AcceptLanguageResolver, options: ['lang', 'locale', 'l'] },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    WeatherModule,
    OpenWeatherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
