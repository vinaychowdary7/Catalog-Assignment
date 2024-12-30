import React from 'react';

const ChartDataSummary = () => {
  return (
    <div className="bg-white w-[90%] ml-[5%] p-[3%] rounded-lg border-2 text-gray">
      <h1 className="text-2xl font-bold mb-4">ChartData Component Overview</h1>
      <p className="text-lg mb-4">The <strong>ChartData</strong> component is a dynamic, interactive stock chart that visualizes stock prices and volumes over different time ranges. It integrates with <strong>Chart.js</strong> and utilizes a custom <strong>crosshair plugin</strong> to enhance the user experience with hoverable crosshair lines and dynamic data display. The chart can also be toggled between fullscreen and normal views.</p>

      <h2 className="text-xl font-semibold mb-2">Key Features:</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Time Range Selection:</strong> Users can choose from several time ranges: 1d, 3d, 1w, 1m, 6m, 1y, and max. The component fetches new data and updates the chart accordingly.</li>
        <li><strong>Chart Type and Data:</strong> The component uses a Line Chart for stock prices and a Bar Chart for volume, both updated based on the selected time range.</li>
        <li><strong>Crosshair Plugin:</strong> Displays dashed lines on hover, along with the exact stock price at the hovered point.</li>
        <li><strong>Annotations:</strong> A label annotation is used to highlight the last stock price value on the chart.</li>
        <li><strong>Fullscreen Toggle:</strong> The chart can be toggled between fullscreen and normal view for detailed analysis.</li>
        <li><strong>Data Generation:</strong> Randomly generates stock price and volume data, with the last two stock prices sent to the parent component via the <code>onStockPointsUpdate</code> prop.</li>
        <li><strong>Styling:</strong> The component uses Tailwind CSS for styling, with responsive design and fullscreen support.</li>
      </ul>
      
    </div>
  );
};

export default ChartDataSummary;
