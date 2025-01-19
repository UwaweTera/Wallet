import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Transaction, Account, Budget, Category } from "../types";
import { MonthlyTrendsChart } from "../components/MonthlyTrendsChart";
import { ExpensesByCategory } from "../components/ExpensesByCategory";

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    // Load user data
    const loadUserData = () => {
      const currentMonth = new Date().toISOString().slice(0, 7);

      // Load transactions
      const savedTransactions = localStorage.getItem("wallet_transactions");
      if (savedTransactions) {
        const userTransactions = JSON.parse(savedTransactions)
          .filter((t: Transaction) => t.userId === currentUser.id)
          .sort(
            (a: Transaction, b: Transaction) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        setTransactions(userTransactions);
      }

      // Load accounts
      const savedAccounts = localStorage.getItem("wallet_accounts");
      if (savedAccounts) {
        const userAccounts = JSON.parse(savedAccounts).filter(
          (a: Account) => a.userId === currentUser.id
        );
        setAccounts(userAccounts);
      }

      // Load budgets
      const savedBudgets = localStorage.getItem("wallet_budgets");
      if (savedBudgets) {
        const userBudgets = JSON.parse(savedBudgets).filter(
          (b: Budget) => b.userId === currentUser.id && b.month === currentMonth
        );
        setBudgets(userBudgets);
      }

      // Load categories
      const savedCategories = localStorage.getItem("wallet_categories");
      if (savedCategories) {
        const userCategories = JSON.parse(savedCategories).filter(
          (c: Category) => c.userId === currentUser.id
        );
        setCategories(userCategories);
      }
    };

    loadUserData();
  }, [currentUser]);

  const calculateTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const calculateMonthlyStats = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = transactions.filter((t) =>
      t.date.startsWith(currentMonth)
    );

    return monthlyTransactions.reduce(
      (stats, t) => ({
        income: stats.income + (t.type === "income" ? t.amount : 0),
        expenses: stats.expenses + (t.type === "expense" ? t.amount : 0),
      }),
      { income: 0, expenses: 0 }
    );
  };

  const StatCard: React.FC<{ title: string; value: string; type?: string }> = ({
    title,
    value,
    type = "default",
  }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p
        className={`text-xl font-semibold ${
          type === "success"
            ? "text-green-500"
            : type === "danger"
            ? "text-red-500"
            : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );

  const monthlyStats = calculateMonthlyStats();

  // Add inside Dashboard component
  const prepareMonthlyData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toISOString().slice(0, 7);
    }).reverse();

    const monthlyData = last6Months.map((month) => {
      const monthTransactions = transactions.filter((t) =>
        t.date.startsWith(month)
      );
      return {
        month: month,
        income: monthTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0),
        expenses: monthTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    });

    return {
      categories: monthlyData.map((d) => d.month),
      incomeData: monthlyData.map((d) => d.income),
      expenseData: monthlyData.map((d) => d.expenses),
    };
  };

  const prepareCategoryData = () => {
    const categoryExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const category =
          categories.find((c) => c.id === t.category)?.name || "Other";
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryExpenses).map(([name, value]) => ({
      name,
      value,
    }));
  };

  return (
    <div className="pt-8 pb-20  main-container">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Balance"
          value={`$${calculateTotalBalance().toFixed(2)}`}
        />
        <StatCard
          title="Monthly Income"
          value={`$${monthlyStats.income.toFixed(2)}`}
          type="success"
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${monthlyStats.expenses.toFixed(2)}`}
          type="danger"
        />
        <StatCard
          title="Net Flow"
          value={`$${(monthlyStats.income - monthlyStats.expenses).toFixed(2)}`}
          type={
            monthlyStats.income >= monthlyStats.expenses ? "success" : "danger"
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <MonthlyTrendsChart {...prepareMonthlyData()} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
          <ExpensesByCategory data={prepareCategoryData()} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link
          to="/transactions"
          className="bg-blue-500 text-white rounded-lg p-4 text-center hover:bg-blue-600"
        >
          Add Transaction
        </Link>
        <Link
          to="/budgets"
          className="bg-green-500 text-white rounded-lg p-4 text-center hover:bg-green-600"
        >
          Manage Budget
        </Link>
        <Link
          to="/accounts"
          className="bg-purple-500 text-white rounded-lg p-4 text-center hover:bg-purple-600"
        >
          View Accounts
        </Link>
        <Link
          to="/reports"
          className="bg-orange-500 text-white rounded-lg p-4 text-center hover:bg-orange-600"
        >
          View Reports
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {
                      categories.find((c) => c.id === transaction.category)
                        ?.name
                    }
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"} $
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/transactions"
            className="text-blue-500 block mt-4 text-center"
          >
            View All Transactions
          </Link>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
          <div className="space-y-4">
            {budgets.map((budget) => {
              const category = categories.find(
                (c) => c.id === budget.categoryId
              );
              const progress = (budget.spent / budget.amount) * 100;

              return (
                <div key={budget.id}>
                  <div className="flex justify-between mb-1">
                    <span>{category?.name}</span>
                    <span>
                      ${budget.spent} / ${budget.amount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        progress > 100 ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/budgets" className="text-blue-500 block mt-4 text-center">
            Manage Budgets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
