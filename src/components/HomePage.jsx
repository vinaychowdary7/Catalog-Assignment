import React, { useState } from 'react';
import InPageNavigation from './InPageNavigation';
import ChartData from './ChartData';
import ChartDataSummary from './ChartDataSummary';

const HomePage = () => {
  

  const [selectedTab, setSelectedTab] = useState(1);
  
  const [lastStockPoint, setLastStockPoint] = useState(0);
  const [secondLastStockPoint, setSecondLastStockPoint] = useState(0);

  // Function to update last and second-last stock points
  const handleStockPoints = (lastPoint, secondLastPoint) => {
    setLastStockPoint(lastPoint);
    setSecondLastStockPoint(secondLastPoint);
  };
  const formattedStockPrice = new Intl.NumberFormat('en-US').format(lastStockPoint);
  const formattedChange = new Intl.NumberFormat('en-US').format(lastStockPoint-secondLastStockPoint);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <ChartDataSummary/>;
      case 1:
        return <ChartData onStockPointsUpdate={handleStockPoints} />; // Pass the function as a prop
      case 2:
        return <div>Statistics</div>;
      case 3:
        return <div>Analysis Content</div>;
      case 4:
        return <div>Settings</div>;
      default:
        return <div>Select a Tab</div>;
    }
  };

  return (
    <div className='flex flex-col gap-y-3'>
      <h2 className='text-6xl font-Circular Std mt-10 ml-14 font-semibold'>
        {formattedStockPrice} <span className='text-2xl text-gray-300 align-super'>USD</span>
      </h2>
      <p className='ml-14' style={{ color: lastStockPoint-secondLastStockPoint >= 0 ? '#67bf6b' : 'red' }}>
        {lastStockPoint-secondLastStockPoint >= 0 ? `+${formattedChange}` : `${formattedChange}`} 
        ({(((lastStockPoint-secondLastStockPoint) / (lastStockPoint - (lastStockPoint-secondLastStockPoint))) * 100).toFixed(2)}%)
      </p>
      <InPageNavigation routes={["Summary", "Chart", "Statistics", "Analysis", "Settings"]} setSelectedTab={setSelectedTab} />
      <div className="mt-5 ml-14">{renderTabContent()}</div>

    </div>
  );
};

export default HomePage;
