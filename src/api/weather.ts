const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Fetch weather by city name
export async function fetchWeather(city: string) {
  const res = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

// Fetch AQI by coordinates
export async function fetchAQI(lat: number, lon: number) {
  const res = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch AQI");
  return res.json();
}
