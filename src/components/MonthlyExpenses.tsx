import React, { useEffect, useState } from "react";
import { Expense } from "../types";
import { formatDate, truncateString } from "../utils";
import ReactApexChart from "react-apexcharts";

interface ExpenseMonthlyProps {
  expenses: Expense[];
}

export const MonthlyExpenses: React.FC<ExpenseMonthlyProps> = ({
  expenses,
}) => {
  const [monthlyTotals, setMonthlyTotals] = useState<
    { month: string; total: number }[]
  >([]);

  // Calculate monthly totals for bar chart
  useEffect(() => {
    const monthlyData: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const month = new Date(expense.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });
    setMonthlyTotals(
      Object.entries(monthlyData).map(([month, total]) => ({ month, total }))
    );
  }, [expenses]);

  // Bar chart options and series data
  const columnChartOptions = {
    xaxis: {
      categories: monthlyTotals.map((entry) => entry.month),
    },
    colors: ["#4C51BF"],
  };

  const columnChartSeries = [
    {
      name: "Expenses",
      data: monthlyTotals.map((entry) => entry.total),
    },
  ];

  // Sort expenses by date for the Recent Expenses table
  const expensesByDate = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
      {/* Monthly Expense Trend - Bar Chart */}
      <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium mb-4">Monthly Expense Trend</h2>
        {monthlyTotals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses found</p>
        ) : (
          <ReactApexChart
            options={columnChartOptions}
            series={columnChartSeries}
            type="bar"
            height={350}
          />
        )}
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-medium mb-4">Recent Expenses</h2>
        <div className="overflow-x-auto">
          {expensesByDate.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expenses found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {expensesByDate.slice(0, 6).map((expense) => (
                  <tr
                    key={expense.date + expense.description}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(expense.date)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {truncateString(expense.description, 30)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium text-gray-800">
                      ${expense.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>{" "}
      </div>
    </div>
  );
};
