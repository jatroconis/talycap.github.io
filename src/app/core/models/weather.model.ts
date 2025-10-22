// ====== Ciudades ======
export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

export interface OmCurrentWeather {
  temperature: number;  
  weathercode: number;  
  time: string;       
}
export interface OmForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: OmCurrentWeather;
}

export interface CityWeather {
  city: City;
  tempC: number;
  description: string;
  icon: string;       
  updatedAt: string;
}

type CodeMap = { range: number[]; desc: string; icon: string };

const WEATHER_MAP: CodeMap[] = [
  { range: [0], desc: 'Cielo despejado', icon: 'wb_sunny' },
  { range: [1, 2], desc: 'Mayormente despejado', icon: 'light_mode' },
  { range: [3], desc: 'Nublado', icon: 'cloud' },
  { range: [45, 48], desc: 'Niebla', icon: 'foggy' },           
  { range: [51, 53, 55], desc: 'Llovizna', icon: 'grain' },
  { range: [56, 57], desc: 'Llovizna congelante', icon: 'ac_unit' },
  { range: [61, 63, 65], desc: 'Lluvia', icon: 'rainy' },          
  { range: [66, 67], desc: 'Lluvia congelante', icon: 'ac_unit' },
  { range: [71, 73, 75], desc: 'Nieve', icon: 'snowing' },        
  { range: [77], desc: 'Cristales de hielo', icon: 'ac_unit' },
  { range: [80, 81, 82], desc: 'Chubascos', icon: 'rainy' },
  { range: [85, 86], desc: 'Chubascos de nieve', icon: 'snowing' },
  { range: [95], desc: 'Tormenta eléctrica', icon: 'thunderstorm' },
  { range: [96, 99], desc: 'Tormenta con granizo', icon: 'thunderstorm' },
];

export function codeToDescIcon(code: number): { desc: string; icon: string } {
  const found = WEATHER_MAP.find(m => m.range.includes(code));
  return found ?? { desc: 'Desconocido', icon: 'help' };
}

export function mapOpenMeteoToCityWeather(city: City, dto: OmForecastResponse): CityWeather {
  const cw = dto.current_weather;
  const m = codeToDescIcon(cw?.weathercode ?? -1);
  return {
    city,
    tempC: cw?.temperature ?? NaN,
    description: m.desc,
    icon: m.icon,
    updatedAt: cw?.time ?? new Date().toISOString(),
  };
}
