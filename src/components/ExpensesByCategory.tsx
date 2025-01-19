import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface CategoryExpenseProps {
  data: { name: string; value: number; }[];
}

export const ExpensesByCategory: React.FC<CategoryExpenseProps> = ({ data }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'pie' as const,
    },
    labels: data.map(item => item.name),
    colors: ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'],
    legend: {
      position: 'bottom'
    }
  };

  const series = data.map(item => item.value);

  return (
    <ReactApexChart 
      options={options}
      series={series}
      type="pie"
      height={350}
    />
  );
};