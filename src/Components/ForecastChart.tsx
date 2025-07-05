import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ✅ Component start
type Props = { city: string };

export default function ForecastChart({ city }: Props) {
  const [hours, setHours] = useState<string[]>([]);
  const [temps, setTemps] = useState<number[]>([]);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await res.json();
        const timezoneOffset = data.city?.timezone ?? 0; // in seconds
  
        const sliced = data.list.slice(0, 6); // 6 time points
  
        setHours(
          sliced.map((item: any) => {
            const localTime = new Date((item.dt + timezoneOffset) * 1000);
            return localTime.toLocaleTimeString("en-IN", {
              hour: "numeric",
              hour12: true,
            });
          })
        );
        
        setTemps(sliced.map((item: any) => item.main.temp));
      } catch (err) {
        console.error("Failed to load forecast:", err);
      }
    }
  
    fetchForecast();
  }, [city]);
  


  const data = {
    labels: hours,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temps,
        borderColor: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.2)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
}
