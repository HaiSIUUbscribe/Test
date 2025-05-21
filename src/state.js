import React, { createContext, useContext, useState } from "react";

// Tạo Context cho giỏ hàng
const CartContext = createContext();

// Provider để quản lý trạng thái giỏ hàng
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        return [...prevItems, item];
      }
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook để sử dụng giỏ hàng
export const useCart = () => useContext(CartContext);