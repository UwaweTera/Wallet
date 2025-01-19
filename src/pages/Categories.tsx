import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster, toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Category } from "../types";

const Categories: React.FC = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (!currentUser?.id) return;

    const savedCategories = localStorage.getItem("wallet_categories");
    if (savedCategories) {
      const allCategories: Category[] = JSON.parse(savedCategories);
      const userCategories = allCategories.filter(
        (category) => category.userId === currentUser.id
      );
      setCategories(userCategories);
    }
  }, [currentUser]);

  const handleAddCategory = () => {
    if (!currentUser?.id) {
      toast.error("Please login to add a category");
      return;
    }

    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const categoryToAdd: Category = {
      id: uuidv4(),
      userId: currentUser.id,
      name: newCategory,
      subCategories: [],
    };

    const savedCategories = localStorage.getItem("wallet_categories");
    const allCategories: Category[] = savedCategories
      ? JSON.parse(savedCategories)
      : [];
    const updatedCategories = [...allCategories, categoryToAdd];

    localStorage.setItem(
      "wallet_categories",
      JSON.stringify(updatedCategories)
    );
    setCategories((prev) => [...prev, categoryToAdd]);
    setNewCategory("");
    toast.success("Category added successfully");
  };

  const handleAddSubCategory = () => {
    if (!currentUser?.id) {
      toast.error("Please login to add a subcategory");
      return;
    }

    if (!newSubCategory.trim() || !selectedCategory) {
      toast.error("Please select a category and enter a subcategory name");
      return;
    }

    const savedCategories = localStorage.getItem("wallet_categories");
    const allCategories: Category[] = savedCategories
      ? JSON.parse(savedCategories)
      : [];

    const updatedAllCategories = allCategories.map((cat) => {
      if (cat.id === selectedCategory && cat.userId === currentUser.id) {
        return {
          ...cat,
          subCategories: [...cat.subCategories, newSubCategory],
        };
      }
      return cat;
    });

    localStorage.setItem(
      "wallet_categories",
      JSON.stringify(updatedAllCategories)
    );

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === selectedCategory) {
          return {
            ...cat,
            subCategories: [...cat.subCategories, newSubCategory],
          };
        }
        return cat;
      })
    );

    setNewSubCategory("");
    toast.success("Subcategory added successfully");
  };

  const handleDeleteCategory = (id: string) => {
    const savedCategories = localStorage.getItem("wallet_categories");
    if (!savedCategories) return;

    const allCategories: Category[] = JSON.parse(savedCategories);
    const updatedAllCategories = allCategories.filter((cat) => cat.id !== id);

    localStorage.setItem(
      "wallet_categories",
      JSON.stringify(updatedAllCategories)
    );
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success("Category deleted successfully");
  };

  const handleDeleteSubCategory = (
    categoryId: string,
    subCategoryIndex: number
  ) => {
    const savedCategories = localStorage.getItem("wallet_categories");
    if (!savedCategories) return;

    const allCategories: Category[] = JSON.parse(savedCategories);
    const updatedAllCategories = allCategories.map((cat) => {
      if (cat.id === categoryId && cat.userId === currentUser?.id) {
        return {
          ...cat,
          subCategories: cat.subCategories.filter(
            (_, index) => index !== subCategoryIndex
          ),
        };
      }
      return cat;
    });

    localStorage.setItem(
      "wallet_categories",
      JSON.stringify(updatedAllCategories)
    );

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subCategories: cat.subCategories.filter(
              (_, index) => index !== subCategoryIndex
            ),
          };
        }
        return cat;
      })
    );

    toast.success("Subcategory deleted successfully");
  };

  return (
    <div className="pt-8 pb-20  main-container">
      <Toaster position="top-center" richColors />
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          {/* Add Category Form */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-md font-medium mb-2">Add New Category</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border p-2 rounded flex-grow"
              />
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>

          {/* Add Subcategory Form */}
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-md font-medium mb-2">Add New Subcategory</h2>
            <div className="space-y-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  className="border p-2 rounded flex-grow"
                />
                <button
                  onClick={handleAddSubCategory}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4 col-span-2">
          {categories.length === 0 ? (
            <div className="bg-white p-4 rounded shadow text-center text-gray-500">
              No categories found. Add a new category to get started.
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
                <div className="pl-4">
                  {category.subCategories.map((subCat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <span>{subCat}</span>
                      <button
                        onClick={() =>
                          handleDeleteSubCategory(category.id, index)
                        }
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;