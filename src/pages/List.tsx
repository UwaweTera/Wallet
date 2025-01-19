import { useEffect, useState } from "react";
import { Expense } from "../types";
import { Toaster, toast } from "sonner";
import { Table } from "../components/Table";
import { ExpenseFilter } from "../components/ExpenseFilter";

export const List = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetching expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const storedExpenses = localStorage.getItem("expenses");
        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        }
      } catch (error) {
        toast.error("Error loading expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter expenses based on selected categories
  const filteredExpenses = selectedCategories.length
    ? expenses.filter((expense) =>
        selectedCategories.includes(expense.category)
      )
    : expenses;

  const handleDelete = (index: number) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    toast.success("Expense deleted successfully");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 mb-16">
      <Toaster position="top-center" richColors />
      <ExpenseFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <div className="flex-1 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          Expense History
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table expenses={filteredExpenses} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
};
