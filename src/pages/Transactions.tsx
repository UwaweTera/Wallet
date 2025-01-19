import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster, toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Account, Category, NewTransaction, Transaction } from "../types";
import { checkAndUpdateBudget } from "../utils";

const Transactions: React.FC = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    subCategory: "",
    accountId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!currentUser?.id) return;

    // Load user's accounts
    const savedAccounts = localStorage.getItem("wallet_accounts");
    if (savedAccounts) {
      const allAccounts: Account[] = JSON.parse(savedAccounts);
      const userAccounts = allAccounts.filter(
        (account) => account.userId === currentUser.id
      );
      setAccounts(userAccounts);
    }

    // Load user's transactions
    const savedTransactions = localStorage.getItem("wallet_transactions");
    if (savedTransactions) {
      const allTransactions: Transaction[] = JSON.parse(savedTransactions);
      const userTransactions = allTransactions.filter(
        (transaction) => transaction.userId === currentUser.id
      );
      setTransactions(userTransactions);
    }

    // Load categories
    const savedCategories = localStorage.getItem("wallet_categories");
    if (savedCategories) {
      const allCategories: Category[] = JSON.parse(savedCategories);
      const userCategories = allCategories.filter(
        (category) => category.userId === currentUser.id
      );
      setCategories(userCategories);
    }
  }, [currentUser]);

  const handleAddTransaction = () => {
    if (!currentUser?.id) {
      toast.error("Please login to add a transaction");
      return;
    }

    if (!newTransaction.accountId || !newTransaction.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const transaction: Transaction = {
      ...newTransaction,
      id: uuidv4(),
      userId: currentUser.id,
    };

    // Check budget before adding transaction
    const transactionMonth = transaction.date.substring(0, 7); // Get YYYY-MM
    const isOverBudget = checkAndUpdateBudget(transaction, transactionMonth);

    if (isOverBudget) {
      toast.warning(
        "This transaction will exceed your budget for this category!"
      );
    }

    // Update account balance
    const updatedAccounts = accounts.map((account) => {
      if (account.id === transaction.accountId) {
        const balanceChange =
          transaction.type === "income"
            ? transaction.amount
            : -transaction.amount;
        return {
          ...account,
          balance: account.balance + balanceChange,
        };
      }
      return account;
    });

    // Save transaction and updated accounts
    const savedTransactions = localStorage.getItem("wallet_transactions");
    const allTransactions: Transaction[] = savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
    const updatedTransactions = [...allTransactions, transaction];

    localStorage.setItem(
      "wallet_transactions",
      JSON.stringify(updatedTransactions)
    );
    localStorage.setItem("wallet_accounts", JSON.stringify(updatedAccounts));

    setTransactions((prev) => [...prev, transaction]);
    setAccounts(updatedAccounts);
    toast.success("Transaction added successfully");

    // Reset form
    setNewTransaction({
      type: "expense",
      amount: 0,
      description: "",
      category: "",
      subCategory: "",
      accountId: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
<div className=" pt-8 pb-20 main-container">
      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
      <Toaster position="top-center" richColors />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add Transaction Form */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-md font-medium mb-2">Add New Transaction</h2>
          <div className="space-y-2">
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  type: e.target.value as "income" | "expense",
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select
              value={newTransaction.accountId}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  accountId: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>

            <select
              value={newTransaction.category}
              onChange={(e) => {
                const category = categories.find(
                  (c) => c.id === e.target.value
                );
                setSelectedCategory(category || null);
                setNewTransaction({
                  ...newTransaction,
                  category: e.target.value,
                  subCategory: "",
                });
              }}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {selectedCategory && selectedCategory.subCategories.length > 0 && (
              <select
                value={newTransaction.subCategory}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    subCategory: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              >
                <option value="">Select Subcategory</option>
                {selectedCategory.subCategories.map((sub, index) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: Number(e.target.value),
                })
              }
              className="border p-2 rounded w-full"
            />

            <input
              type="text"
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            />

            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <button
              onClick={handleAddTransaction}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2 col-span-2">
          {transactions.length === 0 ? (
            <div className="bg-white p-4 rounded shadow text-center text-gray-500">
              No transactions found. Add your first transaction!
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`bg-white p-4 rounded shadow flex justify-between items-center
                ${
                  transaction.type === "income"
                    ? "border-l-4 border-green-500"
                    : "border-l-4 border-red-500"
                }`}
              >
                <div>
                  <h3 className="font-semibold">{transaction.description}</h3>
                  <p>
                    Category:{" "}
                    {categories.find((c) => c.id === transaction.category)?.name}
                  </p>
                  {transaction.subCategory && (
                    <p>Subcategory: {transaction.subCategory}</p>
                  )}
                  <p>
                    Account:{" "}
                    {accounts.find((a) => a.id === transaction.accountId)?.name}
                  </p>
                  <p>Date: {transaction.date}</p>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"} $
                  {transaction.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;