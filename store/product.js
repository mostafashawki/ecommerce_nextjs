import { create } from 'zustand';
import toast from 'react-hot-toast';
import Resizer from 'react-image-file-resizer';

const useProductStore = create((set, get) => ({
  // State
  product: null,
  products: [],
  currentPage: 1,
  totalPages: 1,
  updatingProduct: null,
  uploading: false,
  showImagePreviewModal: false,
  currentImagePreviewUrl: "",
  showRatingModal: false,
  currentRating: 0,
  comment: "",
  brands: [],
  productSearchQuery: "",
  productSearchResults: [],

  // Setters
  setProduct: (product) => set({ product }),
  setProducts: (products) => set({ products }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setUpdatingProduct: (updatingProduct) => set({ updatingProduct }),
  setUploading: (uploading) => set({ uploading }),
  setShowImagePreviewModal: (show) => set({ showImagePreviewModal: show }),
  setCurrentImagePreviewUrl: (url) => set({ currentImagePreviewUrl: url }),
  setShowRatingModal: (show) => set({ showRatingModal: show }),
  setCurrentRating: (rating) => set({ currentRating: rating }),
  setComment: (comment) => set({ comment }),
  setBrands: (brands) => set({ brands }),
  setProductSearchQuery: (query) => set({ productSearchQuery: query }),
  setProductSearchResults: (results) => set({ productSearchResults: results }),

  // Actions
  openImagePreviewModal: (url) => {
    set({ currentImagePreviewUrl: url, showImagePreviewModal: true });
  },

  closeModal: () => {
    set({ showImagePreviewModal: false, currentImagePreviewUrl: "", showRatingModal: false });
  },

  uploadImages: (e) => {
    const files = e.target.files;
    const { updatingProduct, product } = get();
    let allUploadedFiles = updatingProduct ? updatingProduct.images || [] : product ? product.images || [] : [];

    if (files) {
      const totalImages = allUploadedFiles.length + files.length;
      if (totalImages > 4) {
        toast.error("You can upload maximum 4 images");
        return;
      }

      set({ uploading: true });
      const uploadPromises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const promise = new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            1280,
            720,
            "JPEG",
            100,
            0,
            (uri) => {
              fetch(`${process.env.API}/admin/upload/image`, {
                method: "POST",
                body: JSON.stringify({ image: uri }),
              })
                .then((response) => response.json())
                .then((data) => {
                  allUploadedFiles.unshift(data);
                  resolve();
                })
                .catch((err) => {
                  console.log("image upload err => ", err);
                  resolve();
                });
            },
            "base64"
          );
        });
        uploadPromises.push(promise);
      }

      Promise.all(uploadPromises).then(() => {
        if (updatingProduct) {
          set({ updatingProduct: { ...updatingProduct, images: allUploadedFiles } });
        } else {
          set({ product: { ...product, images: allUploadedFiles } });
        }
        set({ uploading: false });
      }).catch((err) => {
        console.log("image upload err => ", err);
        set({ uploading: false });
      });
    }
  },

  deleteImage: (public_id) => {
    const { updatingProduct, product } = get();
    set({ uploading: true });
    fetch(`${process.env.API}/admin/upload/image`, {
      method: "PUT",
      body: JSON.stringify({ public_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredImages = updatingProduct 
          ? updatingProduct.images.filter((image) => image.public_id !== public_id)
          : product.images.filter((image) => image.public_id !== public_id);

        if (updatingProduct) {
          set({ updatingProduct: { ...updatingProduct, images: filteredImages } });
        } else {
          set({ product: { ...product, images: filteredImages } });
        }
      })
      .catch((err) => {
        console.log("image delete err => ", err);
      })
      .finally(() => set({ uploading: false }));
  },

  createProduct: async () => {
    const { product } = get();
    try {
      const response = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data.title}" created`);
        set({ product: null }); // Reset product state
        get().fetchProducts(); // Optionally fetch products to update list
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred");
    }
  },

  fetchProducts: async (page = 1) => {
    try {
      const response = await fetch(`${process.env.API}/product?page=${page}`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        set({ products: data.products, currentPage: data.currentPage, totalPages: data.totalPages });
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while fetching products");
    }
  },

  updateProduct: async () => {
    const { updatingProduct } = get();
    try {
      const response = await fetch(`${process.env.API}/admin/product/${updatingProduct._id}`, {
        method: "PUT",
        body: JSON.stringify(updatingProduct),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data.title}" updated`);
        set({ updatingProduct: null }); // Reset updating product state
        get().fetchProducts(); // Optionally refresh the products list
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while updating the product");
    }
  },

  deleteProduct: async () => {
    const { updatingProduct } = get();
    try {
      const response = await fetch(`${process.env.API}/admin/product/${updatingProduct._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success(`Product "${data.title}" deleted`);
        set({ updatingProduct: null }); // Reset updating product state
        get().fetchProducts(); // Optionally refresh the products list
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while deleting the product");
    }
  },

  fetchBrands: async () => {
    try {
      const response = await fetch(`${process.env.API}/product/brands`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        set({ brands: data });
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while fetching brands");
    }
  },

  fetchProductSearchResults: async () => {
    const { productSearchQuery } = get();
    try {
      const response = await fetch(`${process.env.API}/search/products?productSearchQuery=${productSearchQuery}`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok for search results");
      }
      set({ productSearchResults: data });
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while fetching search results");
    }
  },

}));

export default useProductStore;
