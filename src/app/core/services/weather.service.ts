import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { City, CityWeather, OmForecastResponse, mapOpenMeteoToCityWeather } from '../models';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

type WeatherList = { items: CityWeather[] };

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.openMeteoBaseUrl;

  private cache = new Map<string, Observable<WeatherList>>();

  getMany(cities: City[]): Observable<WeatherList> {
    const key = cities.map(c => c.id).join('|');
    const cached = this.cache.get(key);
    if (cached) return cached;

    const calls = cities.map(city =>
      this.http
        .get<OmForecastResponse>(`${this.base}/v1/forecast`, {
          params: {
            latitude: city.lat,
            longitude: city.lon,
            current_weather: true,
            timezone: 'auto'
          }
        })
        .pipe(map(dto => mapOpenMeteoToCityWeather(city, dto)))
    );

    const req$ = forkJoin(calls)
      .pipe(
        map(items => ({ items })),
        shareReplay({ bufferSize: 1, refCount: true })
      );

    this.cache.set(key, req$);
    return req$;
  }
}
