// @ts-nocheck
// TODO: Fix TS errors
'use server';


export async function getCurrentWeather(latitude: number, longitude: number): Promise<string | null> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    console.error('OpenWeatherMap API key is not set.');
    // Return a default or indicate an error, but don't let the AI flow break entirely.
    // For the AI, it's better to have "Unknown" weather than a hard crash.
    return "Weather information unavailable"; 
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching weather: ${response.status}`, errorData);
      return "Weather information unavailable";
    }
    const data = await response.json();

    if (data.weather && data.weather.length > 0) {
      // Combine main weather condition with temperature for a more descriptive string
      const mainCondition = data.weather[0].main;
      const description = data.weather[0].description;
      const temperature = data.main.temp;
      return `${mainCondition} (${description}), ${temperature.toFixed(0)}°C`;
    }
    return "Weather information unavailable";
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return "Weather information unavailable";
  }
}
