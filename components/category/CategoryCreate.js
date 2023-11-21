"use client";
import useCategoryStore from "@/store/category"; // Adjust the import path as per your project structure

export default function CategoryCreate() {
  // Zustand store
  const {
    name,
    setName,
    updatingCategory,
    setUpdatingCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  // Event handlers
  const handleChange = (e) => {
    if (updatingCategory) {
      setUpdatingCategory({ ...updatingCategory, name: e.target.value });
    } else {
      setName(e.target.value);
    }
  };

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (updatingCategory) {
      updateCategory(updatingCategory);
    } else {
      createCategory(name);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (updatingCategory && updatingCategory._id) {
      deleteCategory(updatingCategory._id);
    }
  };

  const handleClear = () => setUpdatingCategory(null);

  return (
    <div className="my-5">
      <input
        type="text"
        value={updatingCategory ? updatingCategory.name : name}
        onChange={handleChange}
        className="form-control p-2 my-2"
      />
      <div className="d-flex justify-content-between">
        <button
          className={`btn bg-${updatingCategory ? "info" : "primary"} text-light`}
          onClick={handleCreateOrUpdate}
        >
          {updatingCategory ? "Update" : "Create"}
        </button>

        {updatingCategory && (
          <>
            <button
              className="btn bg-danger text-light"
              onClick={handleDelete}
            >
              Delete
            </button>

            <button
              className="btn bg-success text-light"
              onClick={handleClear}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
