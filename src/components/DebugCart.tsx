"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function DebugCart() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Sadece development modunda göster
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg z-50 max-w-xs">
      <h4 className="font-bold mb-2">🐛 Debug Cart</h4>
      <p className="text-sm mb-2">
        Toplam Ürün: <span className="font-bold">{totalQuantity}</span>
      </p>
      <p className="text-sm mb-2">
        Sepetteki Ürünler: <span className="font-bold">{cartItems.length}</span>
      </p>
      <details className="text-xs">
        <summary className="cursor-pointer">Cart Items</summary>
        <pre className="mt-2 text-xs overflow-auto max-h-32">
          {JSON.stringify(cartItems, null, 2)}
        </pre>
      </details>
    </div>
  );
}
