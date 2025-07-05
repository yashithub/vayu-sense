import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

type Props = {
  city: string;
};

type AQIData = {
  main: { aqi: number };
  components: {
    pm2_5: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
    so2: number;
  };
};

const AQI_LEVELS = [
  { max: 50, label: "Good", color: "bg-green-500", desc: "Air quality is satisfactory." },
  { max: 100, label: "Moderate", color: "bg-yellow-400", desc: "Air quality is acceptable." },
  { max: 150, label: "Unhealthy for Sensitive Groups", color: "bg-orange-400", desc: "May affect sensitive individuals." },
  { max: 200, label: "Unhealthy", color: "bg-red-500", desc: "Everyone may experience health effects." },
  { max: 300, label: "Very Unhealthy", color: "bg-purple-600", desc: "Health warnings of emergency conditions." },
  { max: Infinity, label: "Hazardous", color: "bg-maroon-700", desc: "Health alert: everyone may be affected." },
];

function getAQILevel(aqi: number | null) {
  if (aqi === null) return { label: "Loading...", color: "bg-gray-400", desc: "" };
  return AQI_LEVELS.find((lvl) => aqi <= lvl.max)!;
}

export default function AQIDashboard({ city }: Props) {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAQI() {
      try {
        setLoading(true);
        const geo = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const geoData = await geo.json();
        const { lat, lon } = geoData[0];

        const aqiRes = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const aqiData = await aqiRes.json();
        setData(aqiData.list[0]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch AQI data:", err);
        setLoading(false);
      }
    }
    fetchAQI();
  }, [city]);

  const pollutants = [
    { label: "PM2.5", unit: "µg/m³", value: data?.components.pm2_5 ?? "–" },
    { label: "PM10", unit: "µg/m³", value: data?.components.pm10 ?? "–" },
    { label: "CO", unit: "ppb", value: data?.components.co ?? "–" },
    { label: "NO₂", unit: "ppb", value: data?.components.no2 ?? "–" },
    { label: "O₃", unit: "ppb", value: data?.components.o3 ?? "–" },
    { label: "SO₂", unit: "ppb", value: data?.components.so2 ?? "–" },
  ];

  const aqi = data?.main.aqi ?? null;
  const aqiLevel = getAQILevel(aqi !== null ? mapAQIValue(aqi) : null);

  function mapAQIValue(apiLevel: number): number {
    // OpenWeather returns AQI levels 1–5, convert to US EPA-style index:
    switch (apiLevel) {
      case 1: return 40;   // Good
      case 2: return 90;   // Fair
      case 3: return 125;  // Moderate
      case 4: return 175;  // Poor
      case 5: return 250;  // Very Poor
      default: return 0;
    }
  }

  return (
    <div className="text-white">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <MapPin size={16} />
        Major Air Pollutants
      </h3>

      <div className="bg-white/10 rounded-xl p-4">
        {/* AQI Summary */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-300">Air Quality Index (AQI)</div>
            <div className="text-4xl font-bold">{aqi !== null ? mapAQIValue(aqi) : "…"}</div>
            <div className="text-sm mt-1">{aqiLevel.label}</div>
          </div>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold ${aqiLevel.color}`}>
            {mapAQIValue(aqi ?? 0)}
          </div>
        </div>
        <p className="text-xs text-gray-300 mb-4">{aqiLevel.desc}</p>

        {/* Pollutants */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {pollutants.map((p) => (
            <div key={p.label} className="bg-white/5 p-3 rounded-md flex justify-between items-center">
              <div className="font-semibold">{p.label}</div>
              <div className="text-right">
                <div className="text-base font-bold">{typeof p.value === "number" ? p.value.toFixed(1) : "–"}</div>
                <div className="text-xs text-gray-300">{p.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AQI Scale */}
      <div className="mt-4">
        <div className="text-xs text-gray-400 mb-1">AQI Scale</div>
        <div className="flex gap-1 h-3">
          <div className="flex-1 bg-green-500" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-orange-400" />
          <div className="flex-1 bg-red-500" />
          <div className="flex-1 bg-purple-600" />
        </div>
        <div className="text-[10px] text-gray-400 flex justify-between mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200+</span>
        </div>
      </div>
    </div>
  );
}
