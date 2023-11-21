import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/product/ProductCard';
// import 'next/navigation';
import '@testing-library/jest-dom';
// to mock the store
import useCartStore from '@/store/cart';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      prefetch: jest.fn(),
      replace: jest.fn(),
    }),
    usePathname: () => '/',
  }));



// jest.mock('next/navigation', () => ({
//     useRouter: jest.fn(),
//   }));


// Mock the useSession hook
jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: null, status: 'unauthenticated' }),
  }));

jest.mock('../../../store/cart', () => ({
    __esModule: true,
    default: jest.fn(),
  }));

  
  const mockedProduct = {
    _id: "655b0ab66310e5a337799d17",
    title: "HONDA ACTIVA 6G",
    slug: "honda-activa-6g",
    description: "The Activa is where Honda finally equipped the Activa with telescopic front suspension.",
    price: 2000,
    color: "Blue",
    brand: "honda",
    stock: 20,
    shipping: true,
    category: "6559e7b247e0bbdc01ff6a54",
    tags: ["655b094d6310e5a337799cf2"],
    images: [
      {
        secure_url: "https://res.cloudinary.com/dtmlulcpw/image/upload/v1700465312/x5vuaudowl4orwjc0aeg.jpg",
        public_id: "x5vuaudowl4orwjc0aeg",
        _id: "655b0ab66310e5a337799d18"
      }
    ],
    sold: 0,
    likes: [],
    ratings: [],
    createdAt: new Date(1700465334046),
    updatedAt: new Date(1700465334046),
    __v: 0
  };
  

// Mock data
// const mockedProduct = {
//   _id: '1',
//   title: 'Test Product',
//   price: 10.00,
//   previousPrice: 15.00,
//   description: 'A short description of the product',
//   images: [{ secure_url: 'path/to/image.jpg' }],
//   category: { name: 'Electronics' },
//   tags: [{ name: 'Tag1' }, { name: 'Tag2' }],
//   createdAt: '2021-01-01',
//   brand: 'TestBrand',
// };

describe('ProductCard', () => {
    beforeEach(() => {
        // Mock implementation of useCartStore
        useCartStore.mockImplementation(() => ({
          cartItems: [],
          addToCart: jest.fn(),
          updateQuantity: jest.fn(),
          removeFromCart: jest.fn(),
        }));
      });
  it('renders without crashing', () => {
    render(<ProductCard product={mockedProduct} />);
    expect(screen.getByText(mockedProduct.title)).toBeInTheDocument();
  });

  it('displays the correct product price information', () => {
    render(<ProductCard product={mockedProduct} />);
    expect(screen.getByText(`$${mockedProduct.price.toFixed(2)}`)).toBeInTheDocument();
  });

  it('renders ProductRating and AddToCart components', () => {
    render(<ProductCard product={mockedProduct} />);
    expect(screen.getByText('Brand: honda')).toBeInTheDocument();
    
  });
});
