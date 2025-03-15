import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { OpenWeatherModule } from './open-weather/open-weather.module';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception-filter';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true
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
    OpenWeatherModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },],
})
export class AppModule { }
