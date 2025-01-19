import { Transaction } from "../types";

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) return str;
  return str.slice(0, num) + "...";
};


export const checkAndUpdateBudget = (
  transaction: Transaction,
  month: string // YYYY-MM
) => {
  const savedBudgets = localStorage.getItem('wallet_budgets');
  if (!savedBudgets) return;

  const budgets = JSON.parse(savedBudgets);
  const relevantBudget = budgets.find(
    (b: any) => 
      b.categoryId === transaction.category && 
      b.month === month &&
      b.userId === transaction.userId
  );

  if (relevantBudget) {
    relevantBudget.spent += transaction.amount;
    localStorage.setItem('wallet_budgets', JSON.stringify(budgets));

    // Return true if over budget
    return relevantBudget.spent > relevantBudget.amount;
  }

  return false;
};
