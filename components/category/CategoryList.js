"use client";
import { useEffect } from "react";
import useCategoryStore from "@/store/category";

export default function CategoryList() {
  const { fetchCategories, categories, setUpdatingCategory } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="my-5">
      {categories?.map((c) => (
        <button className="btn" onClick={() => setUpdatingCategory(c)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
