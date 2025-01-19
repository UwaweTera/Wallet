import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster, toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Account, NewAccount } from "../types";

const Accounts: React.FC = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState<NewAccount>({
    name: "",
    type: "bank",
    balance: 0,
    currency: "USD",
  });

  useEffect(() => {
    if (!currentUser?.id) return;

    const savedAccounts = localStorage.getItem("wallet_accounts");
    if (savedAccounts) {
      const allAccounts: Account[] = JSON.parse(savedAccounts);
      const userAccounts = allAccounts.filter(
        (account) => account.userId === currentUser.id
      );
      setAccounts(userAccounts.reverse());
    }
  }, [currentUser]);

  const handleAddAccount = () => {
    if (!currentUser?.id) {
      toast.error("Please login to add an account");
      return;
    }

    if (!newAccount.name) {
      toast.error("Please enter an account name");
      return;
    }

    const accountToAdd: Account = {
      ...newAccount,
      id: uuidv4(),
      userId: currentUser.id,
    };

    const savedAccounts = localStorage.getItem("wallet_accounts");
    const allAccounts: Account[] = savedAccounts
      ? JSON.parse(savedAccounts)
      : [];
    const updatedAccounts = [accountToAdd, ...allAccounts];

    localStorage.setItem("wallet_accounts", JSON.stringify(updatedAccounts));
    setAccounts((prev) => [accountToAdd, ...prev]);
    toast.success("Account added successfully");

    // Reset form
    setNewAccount({
      name: "",
      type: "bank",
      balance: 0,
      currency: "USD",
    });
  };

  const handleDeleteAccount = (id: string) => {
    const savedAccounts = localStorage.getItem("wallet_accounts");
    if (!savedAccounts) return;

    const allAccounts: Account[] = JSON.parse(savedAccounts);
    const updatedAllAccounts = allAccounts.filter(
      (account) => account.id !== id
    );

    localStorage.setItem("wallet_accounts", JSON.stringify(updatedAllAccounts));
    setAccounts((prev) => prev.filter((account) => account.id !== id));
    toast.success("Account deleted successfully");
  };

  return (
    <div className=" pt-8 pb-20  main-container">
      <h1 className="text-2xl font-semibold mb-4">Accounts</h1>
      <Toaster position="top-center" richColors />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-md font-medium mb-2">Add New Account</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Account Name"
              value={newAccount.name}
              onChange={(e) =>
                setNewAccount({ ...newAccount, name: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <select
              value={newAccount.type}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  type: e.target.value as Account["type"],
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="bank">Bank Account</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
            </select>

            <input
              type="number"
              placeholder="Initial Balance"
              value={newAccount.balance}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  balance: Number(e.target.value),
                })
              }
              className="border p-2 rounded w-full"
            />

            <button
              onClick={handleAddAccount}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Account
            </button>
          </div>
        </div>

        <div className="grid gap-4 col-span-2">
          {accounts.length === 0 ? (
            <div className="bg-white p-4 rounded shadow text-center text-gray-500">
              No accounts available. Add your first account to get started.
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{account.name}</h3>
                  <p>Type: {account.type}</p>
                  <p>
                    Balance: {account.currency} {account.balance}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
