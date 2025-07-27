import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../api/axios";

// Chart.js registration (required for react-chartjs-2 v4+)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyIncomeChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adjust endpoint as needed
        const response = await api.get("/financialReports/monthly");
        console.log("[MonthlyIncomeChart] API response:", response);
        setData(response.data.data); // Expecting array of { month: '2025-07', income: 1000000 }
      } catch (err) {
        console.error("[MonthlyIncomeChart] Error fetching data:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setError("Backend: " + err.response.data.message);
        } else if (err.message) {
          setError("Error: " + err.message);
        } else {
          setError("Failed to fetch monthly income data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data || data.length === 0) return <p>No data available.</p>;

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Income (Rp)",
        data: data.map((item) => item.income),
        backgroundColor: "#2563eb",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Income Report" },
    },
  };

  return <Bar data={chartData} options={options} />;
}
