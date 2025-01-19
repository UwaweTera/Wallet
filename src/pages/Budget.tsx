import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster, toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

interface Budget {
  id: string;
  userId: string;
  month: string;
  categoryId: string;
  amount: number;
  spent: number;
}

const Budget: React.FC = () => {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [newBudget, setNewBudget] = useState({
    categoryId: "",
    amount: 0,
  });

  useEffect(() => {
    if (!currentUser?.id) return;

    // Load categories
    const savedCategories = localStorage.getItem("wallet_categories");
    if (savedCategories) {
      const userCategories = JSON.parse(savedCategories).filter(
        (cat: any) => cat.userId === currentUser.id
      );
      setCategories(userCategories);
    }

    // Load budgets
    const savedBudgets = localStorage.getItem("wallet_budgets");
    if (savedBudgets) {
      const userBudgets = JSON.parse(savedBudgets).filter(
        (budget: Budget) => budget.userId === currentUser.id
      );
      setBudgets(userBudgets);
    }
  }, [currentUser]);

  const handleAddBudget = () => {
    if (!currentUser?.id) {
      toast.error("Please login to set a budget");
      return;
    }

    if (!newBudget.categoryId || newBudget.amount <= 0) {
      toast.error("Please select a category and enter a valid amount");
      return;
    }

    // Check if budget already exists for this category and month
    const existingBudget = budgets.find(
      (b) => b.categoryId === newBudget.categoryId && b.month === selectedMonth
    );

    if (existingBudget) {
      toast.error("Budget already exists for this category and month");
      return;
    }

    const budgetToAdd: Budget = {
      id: uuidv4(),
      userId: currentUser.id,
      month: selectedMonth,
      categoryId: newBudget.categoryId,
      amount: newBudget.amount,
      spent: 0,
    };

    const updatedBudgets = [...budgets, budgetToAdd];
    setBudgets(updatedBudgets);
    localStorage.setItem("wallet_budgets", JSON.stringify(updatedBudgets));

    setNewBudget({ categoryId: "", amount: 0 });
    toast.success("Budget set successfully");
  };

  const calculateProgress = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="pt-8 pb-20 main-container">
      <Toaster position="top-center" richColors />
      <h1 className="text-2xl font-semibold mb-4">Budget Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Set Budget Form */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-md font-medium mb-4">Set New Budget</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                value={newBudget.categoryId}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, categoryId: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Budget Amount</label>
              <input
                type="number"
                value={newBudget.amount}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, amount: Number(e.target.value) })
                }
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              onClick={handleAddBudget}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Set Budget
            </button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="space-y-4">
          <h2 className="text-md font-medium mb-4">Budget Overview</h2>
          {budgets.filter((budget) => budget.month === selectedMonth).length === 0 ? (
            <div className="bg-white p-4 rounded shadow text-center text-gray-500">
              No budgets set for this month
            </div>
          ) : (
            budgets
              .filter((budget) => budget.month === selectedMonth)
              .map((budget) => {
                const category = categories.find(
                  (c) => c.id === budget.categoryId
                );
                const progress = calculateProgress(budget);
                const isOverBudget = budget.spent > budget.amount;

                return (
                  <div key={budget.id} className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{category?.name}</span>
                      <span className={isOverBudget ? "text-red-500" : ""}>
                        ${budget.spent} / ${budget.amount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          isOverBudget ? "bg-red-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;