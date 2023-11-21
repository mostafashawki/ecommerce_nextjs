import {create} from 'zustand';
import toast from 'react-hot-toast';

const useCategoryStore = create((set) => ({
  // State
  name: '',
  categories: [],
  updatingCategory: null,

  // Setters
  setName: (name) => set({ name }),
  setCategories: (categories) => set({ categories }),
  setUpdatingCategory: (updatingCategory) => set({ updatingCategory }),

  // Actions
  createCategory: async (name) => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        toast.success('Category created');
        set((state) => ({
          name: '',
          categories: [data, ...state.categories],
        }));
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Try again');
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        set({ categories: data });
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Try again');
    }
  },

  fetchCategoriesPublic: async () => {
    try {
      const response = await fetch(`${process.env.API}/categories`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        set({ categories: data });
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Try again');
    }
  },

  updateCategory: async (category) => {
    try {
      const response = await fetch(`${process.env.API}/admin/category/${category?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        toast.success('Category updated');
        set((state) => ({
          categories: state.categories.map((cat) => (cat._id === category._id ? data : cat)),
          updatingCategory: null,
        }));
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Try again');
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await fetch(`${process.env.API}/admin/category/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        toast.success('Category deleted');
        set((state) => ({
          categories: state.categories.filter((cat) => cat._id !== categoryId),
          updatingCategory: null,
        }));
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Try again');
    }
  },
}));

export default useCategoryStore;
