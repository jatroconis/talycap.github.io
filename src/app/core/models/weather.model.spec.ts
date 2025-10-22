import { mapOpenMeteoToCityWeather, codeToDescIcon } from './weather.model';

describe('Open-Meteo mappers', () => {
  it('debe mapear current_weather a CityWeather', () => {
    const cw = mapOpenMeteoToCityWeather(
      { id: 'x', name: 'City', lat: 0, lon: 0 },
      { latitude: 0, longitude: 0, timezone: 'UTC', current_weather: { temperature: 20, weathercode: 3, time: '2025-01-01T00:00:00Z' } }
    );
    expect(cw.tempC).toBe(20);
    expect(cw.description.length).toBeGreaterThan(0);
  });

  it('codeToDescIcon debe devolver fallback en desconocidos', () => {
    const r = codeToDescIcon(999);
    expect(r.icon).toBe('help');
  });
});
