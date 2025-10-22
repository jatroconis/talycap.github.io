import { City } from "../models/weather.model";


export const DEFAULT_CITIES: City[] = [
  { id: 'bogota-co',      name: 'Bogotá',        lat: 4.7110,  lon: -74.0721, country: 'CO' },
  { id: 'medellin-co',    name: 'Medellín',      lat: 6.2442,  lon: -75.5812, country: 'CO' },
  { id: 'cartagena-co',   name: 'Cartagena',     lat: 10.3910, lon: -75.4794, country: 'CO' },
  { id: 'barranquilla-co',name: 'Barranquilla',  lat: 10.9639, lon: -74.7964, country: 'CO' },
  { id: 'cali-co',        name: 'Cali',          lat: 3.4516,  lon: -76.5320, country: 'CO' },
  { id: 'buenos-aires-ar',name: 'Buenos Aires',  lat: -34.6037,lon: -58.3816, country: 'AR' },
  { id: 'mexico-city-mx', name: 'Ciudad de México', lat: 19.4326, lon: -99.1332, country: 'MX' },
  { id: 'madrid-es',      name: 'Madrid',        lat: 40.4168, lon: -3.7038,  country: 'ES' },
  { id: 'miami-us',       name: 'Miami',         lat: 25.7617, lon: -80.1918, country: 'US' },
  { id: 'new-york-us',    name: 'New York',      lat: 40.7128, lon: -74.0060, country: 'US' },
];
