import { Expense } from "../types";
import { formatDate, truncateString } from "../utils";

type TableProps = {
  expenses: Expense[];
  onDelete: (index: number) => void;
};

export const Table = ({ expenses, onDelete }: TableProps) => {
  return (
    <table className="w-full bg-white rounded-lg shadow">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left">Date</th>
          <th className="px-6 py-3 text-left">Category</th>
          <th className="px-6 py-3 text-left">Description</th>
          <th className="px-6 py-3 text-right">Amount</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {expenses.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
              No expenses found
            </td>
          </tr>
        ) : (
          expenses.map((expense, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4">{formatDate(expense.date)}</td>
              <td className="px-6 py-4">{expense.category}</td>
              <td className="px-6 py-4">
                {truncateString(expense.description, 30)}
              </td>
              <td className="px-6 py-4 text-right">
                {expense.amount.toFixed(2)} RWF
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
