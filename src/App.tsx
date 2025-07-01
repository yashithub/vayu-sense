// App.tsx – live weather + AQI dashboard (blue‑indigo theme)
import React, { useEffect, useState } from "react";
import {
  MapPin,
  CloudSun,
  Navigation,
  Wind,
  Droplets,
  GaugeCircle,
  SunMedium,
  Globe,
  Settings,
} from "lucide-react";
import ForecastChart from "./Components/ForecastChart";   // <-- ensure lowercase folder
import { fetchWeather, fetchAQI } from "./api/weather";

// ── helpers ─────────────────────────────────────────────
async function detectCity(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${
            import.meta.env.VITE_OPENWEATHER_API_KEY
          }`
        );
        const json = await res.json();
        resolve(json?.[0]?.name ?? null);
      },
      () => resolve(null),
      { timeout: 5000 }
    );
  });}

const cities = ["Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai", "Meerut", "Ghaziabad", "Noida","Jhansi","Islamabad"];

const cityImages: Record<string, string> = {
  Delhi:     "https://source.unsplash.com/1600x800/?delhi,skyline",
  Mumbai:    "https://source.unsplash.com/1600x800/?mumbai,skyline",
  Bengaluru: "https://source.unsplash.com/1600x800/?bangalore,skyline",
  Kolkata:   "https://source.unsplash.com/1600x800/?kolkata,skyline",
  Chennai:   "https://source.unsplash.com/1600x800/?chennai,skyline",
  Meerut:    "https://source.unsplash.com/1600x800/?meerut,skyline",
  Ghaziabad: "https://source.unsplash.com/1600x800/?ghaziabad,skyline",
  Noida:     "https://source.unsplash.com/1600x800/?noida,skyline",
};

const activities = [
  { id: 1, img: "./assets/garden.jpg", label: "Garden 2 km away" },
  { id: 2, img: "./assets/park.jpg",   label: "Park 1.5 km away" },
  { id: 3, img: "./assets/pool.jpeg",   label: "Pool 3 km away" },
  { id: 4, img: "./assets/gym.jpeg",  label: "Gym 500 m away" },
];

const aqiInfo = (level: number | null) => {
  switch (level) {
    case 1: return { text: "Good 😊",      color: "bg-green-500"  };
    case 2: return { text: "Fair 🙂",      color: "bg-yellow-400" };
    case 3: return { text: "Moderate 😐",  color: "bg-orange-400" };
    case 4: return { text: "Poor 😷",      color: "bg-red-500"    };
    case 5: return { text: "Very Poor 🤢", color: "bg-purple-700" };
    default: return { text: "Loading…",   color: "bg-gray-400"   };
  }
};

// ── main component ─────────────────────────────────────
export default function App() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [weather, setWeather] = useState<any>(null);
  const [aqi, setAqi] = useState<number | null>(null);

  // auto‑detect on mount
  useEffect(() => {
    (async () => {
      const auto = await detectCity();
      if (auto && cities.includes(auto)) setSelectedCity(auto);
    })();
  }, []);

  // fetch data whenever city changes
  useEffect(() => {
    async function load() {
      try {
        setWeather(null);
        setAqi(null);
        const w = await fetchWeather(selectedCity);
        setWeather(w);
        const aqiData = await fetchAQI(w.coord.lat, w.coord.lon);
        setAqi(aqiData.list[0].main.aqi);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    load();
  }, [selectedCity]);

  const { text: aqiText, color: aqiColor } = aqiInfo(aqi);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-4 md:p-6 overflow-hidden">
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-black/10 flex flex-col lg:flex-row">
        {/* sidebar */}
        <aside className="w-full lg:w-24 bg-slate-700/40 backdrop-blur-md flex flex-row lg:flex-col items-center justify-between lg:justify-start py-4 lg:py-6 px-4 lg:px-0">
  {/* ISRO Branding */}
  <div className="flex flex-col items-center gap-1 mb-6">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRomGuV0pTfFUXGytdHXaWu6bjZVwmgLTX_Yw&s"
      alt="ISRO Logo"
      className="w-10 h-10 object-contain"
    />
    <div className="text-[10px] font-bold text-slate-300">ISRO</div>
    <div className="text-xs text-white animate-spin-slow">🛰️</div>
  </div>

  {/* Sidebar Icons */}
  <div className="flex lg:flex-col gap-6 lg:gap-4">
    <SidebarIcon icon={<CloudSun size={24} />} label="weather" />
    <SidebarIcon icon={<Navigation size={24} />} label="explore" />
    <SidebarIcon icon={<Globe size={24} />} label="cities" />
    <SidebarIcon icon={<Settings size={24} />} label="settings" />
  </div>
</aside>


        {/* main content */}
        <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto">
          {/* hero banner */}
          <div
            className="w-full h-40 md:h-48 rounded-xl bg-cover bg-center shadow-lg"
            style={{ backgroundImage: `url(${cityImages[selectedCity]})` }}
          />

          {/* dropdown */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-white/20 text-white font-semibold rounded-md px-3 py-1 text-sm backdrop-blur-md w-max"
          >
            {cities.map((city) => (
              <option key={city} value={city} className="text-black">
                {city}
              </option>
            ))}
          </select>

          {/* header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin size={16} />
                <span>{selectedCity}</span>
              </div>
              <h2 className="mt-2 text-4xl font-bold">
                {weather?.weather[0]?.main || "Loading…"}
              </h2>
            </div>
            <CloudSun size={96} className="hidden md:block text-white/80" />
          </div>

          {/* temperature */}
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight drop-shadow">
              {weather ? `${weather.main.temp}°C` : "…"}
            </h1>
            <p className="text-sm text-indigo-100">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* activities */}
          <section className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-1">
              <span className="text-base">❤</span> Activities in your area
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
              {activities.map((act) => (
                <div key={act.id} className="flex-shrink-0">
                  <img src={act.img} alt="activity" className="h-24 w-40 object-cover rounded-lg shadow-md" />
                  <p className="mt-1 text-xs text-center text-white/90">{act.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* forecast + conditions */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            <section className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <ForecastChart />
            </section>

            <section className="w-full lg:w-64 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg flex flex-col gap-4">
              <div className="flex justify-between text-[10px] mb-2 font-semibold uppercase text-white/80">
                {["Fri", "Sat", "Sun", "Mon", "Tue"].map((d) => (
                  <span key={d} className={d === "Sun" ? "text-white font-bold" : ""}>
                    {d}
                  </span>
                ))}
              </div>
              <div className="text-xs flex items-center gap-1">
                <SunMedium size={14} /> 8:00 PM GMT
              </div>
              <hr className="border-white/20" />
              <h4 className="text-xs uppercase tracking-wider text-indigo-100">Air Conditions</h4>
              <InfoRow icon={<GaugeCircle size={14} />} label="Real Feel" value={`${weather?.main?.feels_like ?? "…"}°`} />
              <InfoRow icon={<Wind size={14} />} label="Wind" value={`${weather?.wind?.speed ?? "…"} km/h`} />
              <InfoRow
                icon={<Droplets size={14} />}
                label="AQI"
                value={<span className={`px-2 py-0.5 rounded-full text-xs ${aqiColor}`}>{aqiText}</span>}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── small reusable components ──────────────────────
const SidebarIcon = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex flex-col items-center gap-1 text-[10px] text-white/90 hover:text-white/100">
    {icon}
    <span className="capitalize hidden xl:block">{label}</span>
  </button>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-anchor gap-1 text-indigo-100">
      {icon} {label}
    </div>
    {value}
  </div>
);
