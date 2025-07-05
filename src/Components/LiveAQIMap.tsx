import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type AQILocation = {
  lat: number;
  lon: number;
  aqi: number;
  name: string;
};
function getAQILabel(aqi: number) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Fair";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Hazardous";
}

function getColor(aqi: number) {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  if (aqi <= 200) return "red";
  if (aqi <= 300) return "purple";
  return "maroon";
}

export default function LiveAQIMap() {
  const [locations, setLocations] = useState<AQILocation[]>([]);

  useEffect(() => {
    async function fetchAQIData() {
      const coords = [
        { name: "Moradabad", lat: 28.83, lon: 78.77 },
        { name: "Delhi", lat: 28.61, lon: 77.23 },
        { name: "Lucknow", lat: 26.84, lon: 80.94 },
        { name: "Kanpur", lat: 26.45, lon: 80.34 },
        { name: "Mumbai", lat: 19.076, lon: 72.8777 },
        { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
        { name: "Chennai", lat: 13.0827, lon: 80.2707 },
        { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
        { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
        { name: "Pune", lat: 18.5204, lon: 73.8567 },
        { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
        // Add more as needed
      ];
      

      const results: AQILocation[] = [];

      for (const loc of coords) {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
          );
          const json = await res.json();
      
          const level = Number(json?.list?.[0]?.main?.aqi);
      
          const aqiValue = {
            1: 50,
            2: 100,
            3: 150,
            4: 200,
            5: 300,
          }[level] ?? 0;
      
          if (aqiValue > 0) {
            results.push({
              ...loc,
              aqi: aqiValue,
            });
          } else {
            console.warn(`Invalid AQI level for ${loc.name}:`, level);
          }
      
        } catch (err) {
          console.error(`Failed to fetch AQI for ${loc.name}:`, err);
        }
      }
      
      
      console.log("Fetched AQI data:", results);

      setLocations(results);
    }

    fetchAQIData();
  }, []);

  return (
    <div className="rounded-xl overflow-hidden h-64">
      <MapContainer center={[28.6, 77.2]} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, idx) => (
          <CircleMarker
            key={idx}
            center={[loc.lat, loc.lon]}
            radius={12}
            fillColor={getColor(loc.aqi)}
            fillOpacity={0.8}
            stroke={false}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
  <div className="text-xs font-bold text-white z-50 bg-black bg-opacity-70 px-2 py-1 rounded">
    {loc.name}<br />AQI: {loc.aqi} ({getAQILabel(loc.aqi)})
  </div>
</Tooltip>

          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
