import React, { useState, useEffect } from "react";
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register the plugin
Chart.register(annotationPlugin);

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Import BarElement
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2"; // Import Line from react-chartjs-2

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Register BarElement
  Tooltip,
  Filler
);

const ChartData = () => {
  const [activeRange, setActiveRange] = useState("1w");
  const [chartData, setChartData] = useState(null);

  const timeRanges = ["1d", "3d", "1w", "1m", "6m", "1y", "max"];

  useEffect(() => {
    const { stockPrices, volumes, labels } = generateRandomData(activeRange);
    const chartData = {
      labels,
      datasets: [
        {
          label: "Stock Price",
          data: stockPrices,
          borderColor: "#4b40ee",
          backgroundColor: (context) => {
            const gradient = context.chart.ctx.createLinearGradient(
              0,
              0,
              0,
              context.chart.height
            );
            gradient.addColorStop(0, "rgba(75, 64, 238, 0.3)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            return gradient;
          },
          tension: 0.1,
          pointRadius: 0,
          fill: true,
          borderWidth: 2,  // Specify the border width of the line
          borderSkipped: "none",  // Remove any skipped borders, though lines typically don't have borders on individual sides
          yAxisID: "y",
          type: "line",
        },
        {
          label: "Volume",
          data: volumes,
          backgroundColor: "#e6e8eb",
          borderColor: "transparent",  // Ensure no borders are drawn
          borderWidth: 0, // Ensure no borders are drawn
          tension: 0.4,
          pointRadius: 0,
          borderSkipped: "none", // Remove bottom border for bars
          fill: true,
          yAxisID: "y",
          type: "bar",
          barPercentage: 0.6,  // Adjust width of bars
          categoryPercentage: 0.8,  // Adjust bar category width
        }
      ]
      
      
    };

    setChartData(chartData);
  }, [activeRange]);

  const generateRandomData = (range) => {
    let stockPrices = [];
    let volumes = [];
    let labels = [];

    const length =
      range === "1d"
        ? 10
        : range === "3d"
        ? 10
        : range === "1w"
        ? 7
        : range === "1m"
        ? 30
        : range === "6m"
        ? 6
        : 12;

    for (let i = 0; i < length; i++) {
      let size = range < 10 ? range : 10;
      for (let j = 0; j < size; j++) {
        const price = Math.floor(Math.random() * 10000) + 1000;
        const volume = Math.floor(Math.random() * 1000) + 1;
        stockPrices.push(price);
        volumes.push(volume);
        labels.push(`Label ${i * 10 + j + 1}`);
      }
    }

    return { stockPrices, volumes, labels };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          drawTicks: false,
          color: (context) => {
            return context.index!=0&&context.index % 10 === 0 ? "#e0e0e0" : "transparent";
          },
        },
        ticks: { display: false },
      },
      y: {
        display: false,
        grid: {
          display: false
        },
      },
    },
    hover: {
      mode: "nearest",
      intersect: false,
    },

    plugins: {
      tooltip: {
        enabled: false
      },
      annotation: {
        annotations: {
          lastValue: {
            type: "label",
            xValue: chartData?.labels[chartData.labels.length - 1] || "", // Last x-axis label
            yValue: chartData?.datasets[0].data[chartData.datasets[0].data.length - 1] || 0, // Last stock price
            backgroundColor: "rgba(75, 64, 238, 0.8)",
            content: chartData
              ? `Price: ${chartData.datasets[0].data[chartData.datasets[0].data.length - 1]}`
              : "",
            font: {
              size: 14,
              weight: "bold",
            },
            color: "#ffffff",
            padding: { top: 8, bottom: 8, left: 12, right: 12 },
            textAlign: "center",
          },
        },
      },
      
      
    },
  };

  return (
    <div className="bg-white w-[90%] ml-[5%]">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-y-2">
        <div className="flex flex-wrap gap-5 w-full sm:w-auto justify-start ml-[5%]">
          <button className="text-gray-500 hover:text-black gap-2">
            <i className="fi fi-br-arrow-up-right-and-arrow-down-left-from-center"></i>{" "}
            Fullscreen
          </button>
          <button className="text-gray-500 hover:text-black gap-2">
            <i className="fi fi-br-add"></i> Compare
          </button>
        </div>
        <div className="flex gap-4 w-full sm:w-auto sm:mr-[20%] justify-between sm:justify-start">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`px-3 py-1 rounded-md text-sm text-gray-500 font-roboto w-full sm:w-auto ${
                activeRange === range
                  ? "bg-custom-blue text-white"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="ml-[5%] relative h-96 w-[75%]">
        {chartData && (
          <Line
            data={chartData}
            options={chartOptions}
          />
        )}
      </div>
    </div>
  );
};

export default ChartData;
