import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { OpenWeatherModule } from 'src/open-weather/open-weather.module';

@Module({
  imports: [OpenWeatherModule.forRoot()],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule { }
