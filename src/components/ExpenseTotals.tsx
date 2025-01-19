import React, { useEffect, useState } from "react";
import { Expense } from "../types";
import { formatCurrency } from "../utils";

interface ExpenseTotalsProps {
  expenses: Expense[];
}

export const ExpenseTotals: React.FC<ExpenseTotalsProps> = ({ expenses }) => {
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [highestExpense, setHighestExpense] = useState<number>(0);

  // Calculate totals dynamically
  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const highest =
      expenses.length > 0
        ? Math.max(...expenses.map((expense) => expense.amount))
        : 0;

    // Calculate this month's total
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
    const monthTotal = monthlyExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    // Calculate today's total
    const today = new Date().toLocaleDateString();
    const todayExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date).toLocaleDateString();
      return expenseDate === today;
    });
    const dayTotal = todayExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    setTotalExpenses(total);
    setMonthlyTotal(monthTotal);
    setTodayTotal(dayTotal);
    setHighestExpense(highest);
  }, [expenses]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="bg-blue-500 p-6 rounded-lg shadow-md">
        <h2 className="text-white text-xl font-medium">Total Expenses</h2>
        <p className="text-white text-2xl mt-2">
          {formatCurrency(totalExpenses)} RWF
        </p>
      </div>
      <div className="bg-green-500 p-6 rounded-lg shadow-md">
        <h2 className="text-white text-xl font-medium">This Month's Total</h2>
        <p className="text-white text-2xl mt-2">
          {formatCurrency(monthlyTotal)} RWF
        </p>
      </div>
      <div className="bg-yellow-500 p-6 rounded-lg shadow-md">
        <h2 className="text-white text-xl font-medium">Today's Expenses</h2>
        <p className="text-white text-2xl mt-2">
          {formatCurrency(todayTotal)} RWF
        </p>
      </div>
      <div className="bg-red-500 p-6 rounded-lg shadow-md">
        <h2 className="text-white text-xl font-medium">Highest Expense</h2>
        <p className="text-white text-2xl mt-2">
          {formatCurrency(highestExpense)} RWF
        </p>
      </div>
    </div>
  );
};
