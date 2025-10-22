// ====== Modelo de ciudades (dominio) ======
export interface City {
  id: string;        
  name: string;      // 'Bogotá'
  lat: number;
  lon: number;
  country?: string; 
}

export interface OwWeather {
  id?: number;
  main?: string;
  description?: string;
  icon?: string;
}

export interface OwCurrent {
  dt: number;   
  temp: number;    
  weather: OwWeather[];
}

export interface OwOneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  current: OwCurrent;
}

export interface CityWeather {
  city: City;
  tempC: number;
  description: string;
  icon: string;        
  updatedAt: string;  
}

// ====== Helpers ======
export function mapOneCallToCityWeather(
  city: City,
  dto: OwOneCallResponse
): CityWeather {
  const w = dto.current?.weather?.[0];
  return {
    city,
    tempC: dto.current?.temp ?? NaN,
    description: w?.description ?? '',
    icon: w?.icon ?? '',
    updatedAt: new Date((dto.current?.dt ?? Date.now() / 1000) * 1000).toISOString(),
  };
}

// URL pública de iconos de OpenWeather
export function openWeatherIconUrl(iconCode: string) {
  return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';
}
