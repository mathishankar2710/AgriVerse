export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rain: number;
  isDay: boolean;
  weatherCode: number;
  description: string;
  daily: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    rainSum: number;
    weatherCode: number;
    description: string;
  }>;
}

export function getWeatherDescription(code: number): string {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2 || code === 3) return "Mainly clear / Partly cloudy";
  if (code === 45 || code === 48) return "Fog / Depositing rime fog";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 71 || code === 73 || code === 75) return "Snow fall";
  if (code === 80 || code === 81 || code === 82) return "Rain showers";
  if (code === 95 || code === 96 || code === 99) return "Thunderstorm";
  return "Unknown weather";
}

export async function fetchWeatherForecast(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  
  const data = await res.json();
  
  const current = data.current;
  const dailyData = data.daily;
  
  const daily = dailyData.time.map((time: string, index: number) => ({
    date: time,
    tempMax: dailyData.temperature_2m_max[index],
    tempMin: dailyData.temperature_2m_min[index],
    rainSum: dailyData.precipitation_sum[index],
    weatherCode: dailyData.weather_code[index],
    description: getWeatherDescription(dailyData.weather_code[index]),
  }));
  
  return {
    temp: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    rain: current.precipitation,
    isDay: current.is_day === 1,
    weatherCode: current.weather_code,
    description: getWeatherDescription(current.weather_code),
    daily,
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "AgriAgentPro/1.0",
        },
      }
    );
    if (!res.ok) throw new Error("Reverse geocoding failed");
    const data = await res.json();
    
    const address = data.address;
    const city = address.city || address.town || address.village || address.suburb || address.county;
    const state = address.state;
    const country = address.country;
    
    if (city && state) return `${city}, ${state}`;
    if (city) return `${city}, ${country}`;
    if (state) return `${state}, ${country}`;
    return data.display_name?.split(",").slice(0, 3).join(",") || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (error) {
    console.error("Geocode error:", error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}
