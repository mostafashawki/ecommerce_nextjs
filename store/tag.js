import create from 'zustand';
import toast from 'react-hot-toast';

const useTagStore = create((set) => ({
  // State
  name: '',
  parentCategory: '',
  tags: [],
  updatingTag: null,

  // Setters
  setName: (name) => set({ name }),
  setParentCategory: (parentCategory) => set({ parentCategory }),
  setTags: (tags) => set({ tags }),
  setUpdatingTag: (updatingTag) => set({ updatingTag }),

  // Actions
  createTag: async () => {
    try {
      const { name, parentCategory, tags } = useTagStore.getState();
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentCategory }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        toast.success('Tag created');
        set({ name: '', tags: [data, ...tags] });
      }
    } catch (err) {
      console.log(err);
      toast.error('Error creating tag');
    }
  },

  fetchTags: async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        set({ tags: data });
      }
    } catch (err) {
      console.log(err);
      toast.error('Error fetching tags');
    }
  },

  fetchTagsPublic: async () => {
    try {
      const response = await fetch(`${process.env.API}/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        set({ tags: data });
      }
    } catch (err) {
      console.log(err);
      toast.error('Error fetching public tags');
    }
  },

  updateTag: async () => {
    try {
      const { updatingTag, tags } = useTagStore.getState();
      const response = await fetch(`${process.env.API}/admin/tag/${updatingTag?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatingTag),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        toast.success('Tag updated');
        set({ 
          updatingTag: null,
          tags: tags.map((tag) => (tag._id === data._id ? data : tag)),
        });
      }
    } catch (err) {
      console.log(err);
      toast.error('Error updating tag');
    }
  },

  deleteTag: async () => {
    try {
      const { updatingTag, tags } = useTagStore.getState();
      const response = await fetch(`${process.env.API}/admin/tag/${updatingTag?._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data);
      } else {
        toast.success('Tag deleted');
        set({ 
          updatingTag: null,
          tags: tags.filter((tag) => tag._id !== data._id),
        });
      }
    } catch (err) {
      console.log(err);
      toast.error('Error deleting tag');
    }
  },
}));

export default useTagStore;
