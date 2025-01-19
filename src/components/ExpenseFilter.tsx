
import { categories } from "../data";

type CategoriesProps = {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
};

export const ExpenseFilter = ({
  selectedCategories,
  setSelectedCategories,
}: CategoriesProps) => {
  return (
    <div className="w-full md:w-64 p-4 bg-white border-b md:border-r md:border-b-0">
    <div>
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <div className="mb-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            value="all"
            checked={selectedCategories.length === 0}
            onChange={() => setSelectedCategories([])}
            className="mr-2"
          />
          All
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
        {categories.map((category) => (
          <div key={category.id} className="mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                value={category.label}
                checked={selectedCategories.includes(category.label)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([
                      ...selectedCategories,
                      category.label,
                    ]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((id) => id !== category.label)
                    );
                  }
                }}
                className="mr-2"
              />
              {category.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};
