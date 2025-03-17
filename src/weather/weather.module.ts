import { Module } from '@nestjs/common';
import { OpenWeatherModule } from 'src/open-weather/open-weather.module';
import { WeatherController } from './weather.controller';

@Module({
  imports: [OpenWeatherModule],
  controllers: [WeatherController],
  providers: [],
})
export class WeatherModule {}
