import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {

      const productStorage = await AsyncStorage.getItem('@Marker/products');

      if (productStorage) {
        setProducts(JSON.parse(productStorage));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {

    const productsExists = products.find(p => p.id === product.id);

    if (productsExists){
      setProducts(
        products.map(p => p.id === product.id ? { ...productsExists, quantity: p.quantity + 1 } : p)
      )
    } else {
      setProducts([...products, {...product, quantity: 1}])
    }


    setProducts([...products, product]);

    await AsyncStorage.setItem('@Marker/products', JSON.stringify(products));
  }, [products]);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
