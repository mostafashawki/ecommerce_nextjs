import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(persist(
  (set, get) => ({
    // State
    cartItems: [],
    couponCode: '',
    percentOff: 0,
    validCoupon: false,

    // Setters
    setCartItems: (cartItems) => set({ cartItems }),
    setCouponCode: (couponCode) => set({ couponCode }),
    setPercentOff: (percentOff) => set({ percentOff }),
    setValidCoupon: (validCoupon) => set({ validCoupon }),

    // Actions
    addToCart: (product, quantity) => {
      const { cartItems } = get();
      const existingProduct = cartItems.find((item) => item._id === product._id);

      if (existingProduct) {
        const updatedCartItems = cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        set({ cartItems: updatedCartItems });
      } else {
        set({ cartItems: [...cartItems, { ...product, quantity }] });
      }
    },

    removeFromCart: (productId) => {
      const { cartItems } = get();
      const updatedCartItems = cartItems.filter((item) => item._id !== productId);
      set({ cartItems: updatedCartItems });
    },

    updateQuantity: (product, quantity) => {
      const { cartItems } = get();
      const updatedItems = cartItems.map((item) =>
        item._id === product._id ? { ...item, quantity } : item
      );
      set({ cartItems: updatedItems });
    },

    handleCoupon: async (coupon) => {
      try {
        const response = await fetch(`${process.env.API}/stripe/coupon`, {
          method: 'POST',
          body: JSON.stringify({ couponCode: coupon }),
        });
        if (!response.ok) {
          set({ percentOff: 0, validCoupon: false });
          toast.error('Invalid coupon code');
          return;
        } else {
          const data = await response.json();
          set({ percentOff: data.percent_off, validCoupon: true });
          toast.success(`${data.name} applied successfully`);
        }
      } catch (err) {
        console.log(err);
        set({ percentOff: 0, validCoupon: false });
        toast.error('Invalid coupon code');
      }
    },

    clearCart: () => {
      set({ cartItems: [] });
    },
  }),
  {
    name: 'cart', // unique name for local storage
    getStorage: () => localStorage, // define storage type
    onRehydrateStorage: () => () => {
      // actions to perform when rehydrating
    },
  }
));

export default useCartStore;
