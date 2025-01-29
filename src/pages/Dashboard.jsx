import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import supabase from "../supabaseClient";
import TransactionChart from "../components/TransactionChart";
import DashboardHeader from "../components/DashboardHeader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [areaChartData, setAreaChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      now.setMinutes(0, 0, 0); // Round to the start of the current hour
      const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000); // Last 5 hours

      const { data, error } = await supabase
        .from("bettingdata")
        .select("created_at, bet_amount, result")
        .gte("created_at", fiveHoursAgo.toISOString())
        .lte("created_at", now.toISOString());

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      const hourlyData = {};
      const hourlyBetCount = {};
      for (let i = 0; i < 5; i++) {
        const hourLabel = new Date(now.getTime() - i * 60 * 60 * 1000)
          .toLocaleTimeString([], { hour: "2-digit", hour12: true });
        hourlyData[hourLabel] = { total_win: 0, total_loss: 0 };
        hourlyBetCount[hourLabel] = 0;
      }

      data.forEach((row) => {
        const hour = new Date(row.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          hour12: true,
        });
        if (hourlyData[hour]) {
          if (row.result === "win") {
            hourlyData[hour].total_win += row.bet_amount;
          } else if (row.result === "lost") {
            hourlyData[hour].total_loss += row.bet_amount;
          }
          hourlyBetCount[hour] += 1; // Count the bets for each hour
        }
      });

      const labels = Object.keys(hourlyData).reverse();
      const lossData = labels.map((hour) => hourlyData[hour].total_loss);
      const winData = labels.map((hour) => hourlyData[hour].total_win);
      const betCountData = labels.map((hour) => hourlyBetCount[hour]);

      setChartData({
        labels,
        datasets: [
          {
            label: "Loss Amount",
            data: lossData,
            backgroundColor: "red",
          },
          {
            label: "Win Amount",
            data: winData,
            backgroundColor: "green",
          },
        ],
      });

      setAreaChartData({
        labels,
        datasets: [
          {
            label: "Bet Count",
            data: betCountData,
            fill: true, // This makes it an area chart
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.2)", // Area fill color
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: "blue",
          },
        ],
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "45%", height: "200px" }}>
        {chartData ? <Bar data={chartData} options={{ responsive: true }} /> : "Loading..."}
      </div>
      <div style={{ width: "45%", height: "200px" }}>
        {areaChartData ? <Line data={areaChartData} options={{ responsive: true }} /> : "Loading..."}
      </div>
    </div>
  );
};

function Dashboard() {
  return (
    <div className="w-full h-full ">
            <DashboardHeader/>

      <h2>Hourly Betting Data (Last 5 Hours)</h2>
      <BarChart />
      <div className="w-full flex items-center justify-between">
        <div>line</div>
        <TransactionChart/>
      </div>
    </div>
  );
}

export default Dashboard;
