import React, { useState } from 'react';
import InPageNavigation from './InPageNavigation';
import ChartData from './ChartData';

const HomePage = () => {
  
  const stockPrice = 63179.71;
  const change = 2161.42;

  const formattedStockPrice = new Intl.NumberFormat('en-US').format(stockPrice);
  const formattedChange = new Intl.NumberFormat('en-US').format(change);

  const [selectedTab, setSelectedTab] = useState(1);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <div>Summary</div>;
      case 1:
        return <ChartData/>;
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
      <p className='ml-14' style={{ color: change >= 0 ? '#67bf6b' : 'red' }}>
        {change >= 0 ? `+${formattedChange}` : `${formattedChange}`} 
        ({((change / (stockPrice - change)) * 100).toFixed(2)}%)
      </p>
      <InPageNavigation routes={["Summary", "Chart", "Statistics", "Analysis", "Settings"]}setSelectedTab={setSelectedTab}/>
      <div className="mt-5 ml-14">{renderTabContent()}</div>
    </div>
  );
}

export default HomePage;
