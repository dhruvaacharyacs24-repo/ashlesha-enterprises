"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image_url?: string;
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => ({ success: false, message: "" }),
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

import { useAuth } from "@/context/AuthContext";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user, isAdmin } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  // Derive storage key based on user identity
  const cartKey = useMemo(() => {
    if (user?.id) return `ashlesha_cart_${user.id}`;
    return "ashlesha_cart_guest";
  }, [user?.id]);

  // Load cart from localStorage whenever the user (and thus cartKey) changes
  useEffect(() => {
    setIsLoaded(false);
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
        setCart([]);
      }
    } else {
      setCart([]);
    }
    setIsLoaded(true);
  }, [cartKey]);

  // Save cart to localStorage whenever the cart content or key changes
  // Only save if we've successfully loaded the data for the current key
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, cartKey, isLoaded]);

  const addToCart = (product: any, quantity: number) => {
    if (isAdmin) {
      return { success: false, message: "Administrative accounts cannot purchase items." };
    }
    const existingItem = cart.find((item) => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const requestedTotal = currentQuantity + quantity;

    if (requestedTotal > product.stock) {
      return { 
        success: false, 
        message: `Not enough stock available. Remaining: ${product.stock - currentQuantity}` 
      };
    }

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          stock: product.stock,
          image_url: product.image_url,
          category: product.category,
        },
      ]);
    }

    return { success: true, message: "Added to cart" };
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          // Check stock before updating
          if (quantity > item.stock) {
            return item; // Don't update if exceeds stock
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
