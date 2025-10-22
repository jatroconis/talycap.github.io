
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { City, CityWeather, OwOneCallResponse, mapOneCallToCityWeather } from '../models';
import { forkJoin, Observable, of, timer } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

type WeatherList = { items: CityWeather[] };

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.openWeatherBaseUrl;
  private readonly version = environment.openWeatherVersion;

  private cache = new Map<string, Observable<WeatherList>>();

  /**
   * Trae clima actual para múltiples ciudades
   */
  getMany(cities: City[]): Observable<WeatherList> {
    const key = cities.map(c => c.id).join('|');
    const cached = this.cache.get(key);
    if (cached) return cached;

    // Emite inmediatamente y refresca cada 5 minutos si hay suscriptores
    const req$ = of(null).pipe(
      switchMap(() => {
        const calls = cities.map(city =>
          this.http.get<OwOneCallResponse>(`${this.base}/data/${this.version}/onecall`, {
            params: { lat: city.lat, lon: city.lon, units: 'metric' }
          }).pipe(
            map(dto => mapOneCallToCityWeather(city, dto))
          )
        );
        return forkJoin(calls).pipe(map(items => ({ items })));
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.cache.set(key, req$);
    return req$;
  }
}
