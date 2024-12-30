import React, { useState, useEffect, useRef } from "react";
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Tooltip, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(annotationPlugin);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Tooltip, Filler);

const crosshairPlugin = {
  id: "crosshair",
  beforeEvent: (chart, args) => {
    const { event } = args;
    chart.cursor = { x: event.x, y: event.y };
  },
  afterDatasetsDraw: (chart) => { // Change to `afterDatasetsDraw` to draw on top
    const { ctx, chartArea, cursor } = chart;

    if (cursor && cursor.x >= chartArea.left && cursor.x <= chartArea.right && cursor.y >= chartArea.top && cursor.y <= chartArea.bottom) {
      const x = cursor.x;
      const y = cursor.y;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      const xPos = xScale.getValueForPixel(x);

      if (xPos !== undefined) {
        const dataset = chart.data.datasets[0];
        const labels = chart.data.labels;
        let closestIndex = 0;
        let minDistance = Infinity;

        labels.forEach((label, index) => {
          const labelX = xScale.getPixelForValue(label);
          const distance = Math.abs(labelX - x);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        const hoveredValue = dataset.data[closestIndex];
        
        const labelWidth = 50;
        const labelHeight = 20;
        const xPosLabel = chartArea.right - 50;
        const yPosLabel = y - 10;

        ctx.save();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(xPosLabel + 5, yPosLabel); 
        ctx.arcTo(xPosLabel + labelWidth, yPosLabel, xPosLabel + labelWidth, yPosLabel + labelHeight, 5); 
        ctx.arcTo(xPosLabel + labelWidth, yPosLabel + labelHeight, xPosLabel, yPosLabel + labelHeight, 5); 
        ctx.arcTo(xPosLabel, yPosLabel + labelHeight, xPosLabel, yPosLabel, 5); 
        ctx.arcTo(xPosLabel, yPosLabel, xPosLabel + 5, yPosLabel, 5); 
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(hoveredValue, chartArea.right - 25, y + 5);
        ctx.restore();
      }
    }
  },
};

const ChartData = ({onStockPointsUpdate}) => {
  const [activeRange, setActiveRange] = useState("1w");
  const [chartData, setChartData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef(null);

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
            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, "rgba(75, 64, 238, 0.3)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            return gradient;
          },
          tension: 0.1,
          pointRadius: 0,
          fill: true,
          borderWidth: 2,
          borderSkipped: "none",
          yAxisID: "y",
          type: "line",
        },
        {
          label: "Volume",
          data: volumes,
          backgroundColor: "#e6e8eb",
          borderColor: "transparent",
          borderWidth: 0,
          tension: 0.4,
          pointRadius: 0,
          borderSkipped: "none",
          fill: true,
          yAxisID: "y",
          type: "bar",
          barPercentage: 0.6,
          categoryPercentage: 0.8,
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

    if (stockPrices.length >= 2) {
      const lastPoint = stockPrices[stockPrices.length - 1];
      const secondLastPoint = stockPrices[stockPrices.length - 2];
      onStockPointsUpdate(lastPoint, secondLastPoint);
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
            return context.index !== 0 && context.index % 10 === 0 ? "#e0e0e0" : "transparent";
          },
        },
        ticks: { display: false },
      },
      y: {
        display: false,
        grid: { display: false }
      },
    },
    hover: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      tooltip: { enabled: false },
      annotation: {
        annotations: {
          lastValue: {
            type: "label",
            xValue: chartData?.labels[chartData.labels.length - 1] || "",
            yValue: chartData?.datasets[0].data[chartData.datasets[0].data.length - 1] || 0,
            backgroundColor: "rgba(75, 64, 238)",
            content: chartData ? `${chartData.datasets[0].data[chartData.datasets[0].data.length - 1]}` : "",
            font: { size: 14, weight: "bold" },
            color: "#ffffff",
            padding: { top: 4, bottom: 4, left: 10, right: 12 },
            textAlign: "center",
            xAdjust: -20,
            borderRadius: 5,
          },
        },
      },
    },
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (chartRef.current.requestFullscreen) {
        chartRef.current.requestFullscreen();
      } else if (chartRef.current.mozRequestFullScreen) { // Firefox
        chartRef.current.mozRequestFullScreen();
      } else if (chartRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
        chartRef.current.webkitRequestFullscreen();
      } else if (chartRef.current.msRequestFullscreen) { // IE/Edge
        chartRef.current.msRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-white ml-[5%] ${isFullscreen ? "fullscreen" : ""}`} ref={chartRef}>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-y-2">
        <div className="flex flex-wrap gap-5 w-full sm:w-auto justify-start ml-[5%]">
          <button className="text-gray-500 hover:text-black gap-2" onClick={toggleFullscreen}>
            <i className="fi fi-br-arrow-up-right-and-arrow-down-left-from-center"></i> {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button className="text-gray-500 hover:text-black gap-2">
            <i className="fi fi-br-add"></i> Compare
          </button>
        </div>
        <div className="flex gap-4 w-full sm:w-auto sm:mr-[20%] justify-between sm:justify-start">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`px-3 py-1 rounded-md text-sm text-gray-500 font-roboto w-full sm:w-auto ${activeRange === range ? "bg-custom-blue text-white" : "hover:bg-gray-300"}`}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className={`ml-[5%] relative ${isFullscreen ? 'ml-[5%] mt-[5%] w-[80%] h-[80%]' : 'h-96 w-[75%]'} border-x`}>
        {chartData && <Line data={chartData} options={chartOptions} plugins={[crosshairPlugin]} />}
      </div>
    </div>
  );
};

export default ChartData;
