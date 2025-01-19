import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface MonthlyTrendsProps {
  incomeData: number[];
  expenseData: number[];
  categories: string[];
}

export const MonthlyTrendsChart: React.FC<MonthlyTrendsProps> = ({ 
  incomeData, 
  expenseData, 
  categories 
}) => {
  const options = {
    chart: {
      type: 'line',
      height: 350
    },
    colors: ['#10B981', '#EF4444'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: categories
    },
    legend: {
      position: 'top'
    }
  };

  const series = [
    {
      name: 'Income',
      data: incomeData
    },
    {
      name: 'Expenses',
      data: expenseData
    }
  ];

  return (
    <ReactApexChart 
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};
