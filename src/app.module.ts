import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { OpenWeatherModule } from './open-weather/open-weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WeatherModule,
    OpenWeatherModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
