import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../../environments/environment';
import { City } from '../models';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('WeatherService (Open-Meteo)', () => {
  let service: WeatherService;
  let http: HttpTestingController;
  const base = environment.openMeteoBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(WeatherService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('debe traer clima actual para múltiples ciudades', (done) => {
    const cities: City[] = [
      { id: 'bogota-co', name: 'Bogotá', lat: 4.711, lon: -74.0721 },
      { id: 'madrid-es', name: 'Madrid', lat: 40.4168, lon: -3.7038 },
    ];

    service.getMany(cities).subscribe(res => {
      expect(res.items.length).toBe(2);
      expect(res.items[0].city.name).toBe('Bogotá');
      expect(typeof res.items[0].tempC).toBe('number');
      done();
    });

    const reqs = http.match(r => r.url.startsWith(`${base}/v1/forecast`));
    expect(reqs.length).toBe(2);

    reqs[0].flush({
      latitude: 4.711, longitude: -74.0721, timezone: 'America/Bogota',
      current_weather: { temperature: 18.4, weathercode: 3, time: '2025-10-21T12:00:00Z' }
    });

    reqs[1].flush({
      latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid',
      current_weather: { temperature: 24.1, weathercode: 1, time: '2025-10-21T12:00:00Z' }
    });
  });
});
