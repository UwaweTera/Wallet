export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "bank" | "mobile_money" | "cash";
  balance: number;
  currency: string;
}

export type NewAccount = Omit<Account, "id" | "userId">;

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  subCategory?: string;
  accountId: string;
  date: string;
}

export type NewTransaction = Omit<Transaction, 'id' | 'userId'>;

export interface Category {
  id: string;
  userId: string;
  name: string;
  subCategories: string[];
}


export interface Budget {
  id: string;
  userId: string;
  month: string; // Format: YYYY-MM
  amount: number;
  categoryId: string;
  spent: number;
}

export type Expense = {
  amount: number;
  category: string;
  date: string;
  description: string;
};