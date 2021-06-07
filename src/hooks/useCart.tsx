import React, { createContext, ReactNode, useContext, useState } from 'react';

import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productName: string;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productName: string) => Promise<void>;
  removeProduct: (productName: string) => void;
  updateProductAmount: ({ productName, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@food:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productName: string) => {
    try {
      const memoryCart = [...cart];

      const cartInProduct = memoryCart.find((product) => product.name === productName);

      if (cartInProduct) {
        cartInProduct.amount++;
        localStorage.setItem('@food:cart', JSON.stringify(memoryCart));
        return setCart(memoryCart);
      } else {
        const { data: products } = await api.get<Product[]>('/products/');
        const product = products.find((product) => product.name === productName);
        if (!product) {
          throw new Error('Product is not available');
        }

        product.amount = 1;
        localStorage.setItem('@food:cart', JSON.stringify([...cart, product]));
        return setCart([...cart, product]);
      }
    } catch (error) {
      if (error.response) {
        console.error('Product is not available');
      }
      console.error('Product is not available');
    }
  };

  const removeProduct = (productName: string) => {
    try {
      const products = [...cart];
      const productIndex = products.findIndex((product) => product.name === productName);

      if (productIndex < 0) {
        throw new Error('Erro na remoção do produto');
      }

      products.splice(productIndex, 1);

      localStorage.setItem('@food:cart', JSON.stringify(products));
      setCart(products);
    } catch (error) {
      console.error(error);
    }
  };

  const updateProductAmount = async ({ productName, amount }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        throw new Error('Error on amount update');
      }

      const products = [...cart];

      const product = products.find((product) => product.name === productName);

      if (!product) {
        throw new Error('Error on amount update');
      }

      product.amount = amount;
      localStorage.setItem('@food:cart', JSON.stringify(cart));
      setCart(products);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, updateProductAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
