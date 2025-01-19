import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Transaction, Account, Category } from "../types";

const Reports: React.FC = () => {
  const { currentUser } = useAuth();
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState<"category" | "account">(
    "category"
  );

  useEffect(() => {
    if (!currentUser?.id) return;

    const loadData = () => {
      // Load transactions
      const savedTransactions = localStorage.getItem("wallet_transactions");
      if (savedTransactions) {
        const userTransactions = JSON.parse(savedTransactions)
          .filter((t: Transaction) => t.userId === currentUser.id)
          .filter(
            (t: Transaction) =>
              t.date >= dateRange.startDate && t.date <= dateRange.endDate
          );
        setTransactions(userTransactions);
      }

      // Load accounts and categories
      const savedAccounts = localStorage.getItem("wallet_accounts");
      const savedCategories = localStorage.getItem("wallet_categories");

      if (savedAccounts) {
        setAccounts(
          JSON.parse(savedAccounts).filter(
            (a: Account) => a.userId === currentUser.id
          )
        );
      }
      if (savedCategories) {
        setCategories(
          JSON.parse(savedCategories).filter(
            (c: Category) => c.userId === currentUser.id
          )
        );
      }
    };

    loadData();
  }, [currentUser, dateRange]);

  const generateSummary = () => {
    const summary = transactions.reduce((acc: any, transaction) => {
      const key =
        filterType === "category"
          ? transaction.category
          : transaction.accountId;
      if (!acc[key]) {
        acc[key] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        acc[key].income += transaction.amount;
      } else {
        acc[key].expense += transaction.amount;
      }
      return acc;
    }, {});

    return summary;
  };

  const exportToCSV = () => {
    const summary = generateSummary();
    let csvContent = "Name,Income,Expense,Net\n";

    Object.entries(summary).forEach(([key, data]: [string, any]) => {
      const name =
        filterType === "category"
          ? categories.find((c) => c.id === key)?.name
          : accounts.find((a) => a.id === key)?.name;
      csvContent += `${name},${data.income},${data.expense},${
        data.income - data.expense
      }\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet_report_${dateRange.startDate}_${dateRange.endDate}.csv`;
    a.click();
  };

  return (
    <div className="pt-8 pb-20  main-container">
      <h1 className="text-2xl font-semibold mb-4">Financial Reports</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="border p-2 rounded"
          />
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "category" | "account")
            }
            className="border p-2 rounded"
          >
            <option value="category">By Category</option>
            <option value="account">By Account</option>
          </select>
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-right">Income</th>
                <th className="px-6 py-3 text-right">Expense</th>
                <th className="px-6 py-3 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(generateSummary()).map(
                ([key, data]: [string, any]) => {
                  const name =
                    filterType === "category"
                      ? categories.find((c) => c.id === key)?.name
                      : accounts.find((a) => a.id === key)?.name;
                  return (
                    <tr key={key} className="border-b">
                      <td className="px-6 py-4">{name}</td>
                      <td className="px-6 py-4 text-right text-green-500">
                        ${data.income}
                      </td>
                      <td className="px-6 py-4 text-right text-red-500">
                        ${data.expense}
                      </td>
                      <td className="px-6 py-4 text-right">
                        ${data.income - data.expense}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
