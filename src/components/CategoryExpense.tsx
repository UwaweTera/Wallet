import React, { useEffect, useState } from "react";
import { Expense } from "../types";
import ReactApexChart from "react-apexcharts";

interface ExpenseCategoriesProps {
  expenses: Expense[];
}

export const CategoryExpense: React.FC<ExpenseCategoriesProps> = ({
  expenses,
}) => {
  const [categoryTotals, setCategoryTotals] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const totals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;
    });
    setCategoryTotals(totals);
  }, [expenses]);

  // Prepare data for pie chart
  const pieChartLabels = Object.keys(categoryTotals);
  const pieChartSeries = Object.values(categoryTotals);

  const pieChartOptions = {
    labels: pieChartLabels,
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
  };
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      {/* Expense Categories Table */}
      <div className="w-full lg:w-1/2 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium mb-4">Expense Categories</h2>
        <div className="overflow-x-auto">
          {pieChartLabels.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expenses found</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {pieChartLabels.map((category) => (
                  <tr
                    key={category}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 text-gray-800">{category}</td>
                    <td className="text-right py-3 px-4 text-gray-800 font-medium">
                      ${categoryTotals[category]?.toFixed(2) || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>{" "}
      </div>
      {/* Expense Distribution Pie Chart */}
      <div className="w-full lg:w-1/2 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium mb-4">Expense Distribution</h2>
        {pieChartSeries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses found</p>
        ) : (
          <ReactApexChart
            options={pieChartOptions}
            series={pieChartSeries}
            type="pie"
            height={350}
          />
        )}
      </div>
    </div>
  );
};
