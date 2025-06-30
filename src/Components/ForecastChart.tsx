import React from "react";
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

// 🔧 Dummy hourly data — you can replace this with real API data later
const hours = ["8AM", "11AM", "2PM", "5PM", "8PM", "11PM"];
const temps = [26, 28, 30, 29, 27, 25];

export default function ForecastChart() {
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
