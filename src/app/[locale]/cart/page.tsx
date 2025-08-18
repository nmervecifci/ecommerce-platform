"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCart,
} from "@/store/cartSlice";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";

// Product interface tanımı
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Component mount olduğunda localStorage'dan cart'ı yükle
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  // Toplam fiyat hesaplama
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Toplam ürün sayısı
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (
      window.confirm(
        "Sepetteki tüm ürünleri silmek istediğinizden emin misiniz?"
      )
    ) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Sepetiniz boş!");
      return;
    }

    alert(
      `Toplam ${totalItems} ürün için $${totalPrice.toFixed(
        2
      )} ödeme yapılacak.\n\nÖdeme sayfasına yönlendirileceksiniz.`
    );
  };

  // Placeholder image function - 'any' yerine CartItem kullan
  const getImageSrc = (item: CartItem) => {
    const brokenPatterns = [
      "71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
      "61IBBVJvSDL._AC_SY879_.jpg",
      "81fPKd-2AYL._AC_SL1500_.jpg",
      "51Y5NI-I5jL._AC_UX679_.jpg",
      "71kWymZ+c+L._AC_SX679_.jpg",
    ];

    const imageUrl = item.image || "";
    const isBrokenUrl = brokenPatterns.some((pattern) =>
      imageUrl.includes(pattern)
    );

    if (isBrokenUrl || !imageUrl) {
      const colors = {
        electronics: "1f2937/f3f4f6",
        "men's clothing": "3b82f6/ffffff",
        "women's clothing": "ec4899/ffffff",
        jewelery: "f59e0b/ffffff",
      };
      const colorScheme =
        colors[item.category as keyof typeof colors] || "6b7280/ffffff";
      const categoryDisplay =
        item.category.charAt(0).toUpperCase() + item.category.slice(1);
      return `https://via.placeholder.com/150x150/${colorScheme}?text=${encodeURIComponent(
        categoryDisplay
      )}`;
    }

    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Alışverişe Devam Et
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Sepetim ({totalItems} ürün)
            </h1>
            <button
              onClick={() => (window.location.href = "/products")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Ürünler
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          // Boş Sepet
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sepetiniz Boş
            </h2>
            <p className="text-gray-600 mb-8">
              Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!
            </p>
            <button
              onClick={() => (window.location.href = "/products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Alışverişe Başla
            </button>
          </div>
        ) : (
          // Dolu Sepet
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sepetinizdeki Ürünler
                </h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Sepeti Temizle
                  </button>
                )}
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-4"
                >
                  {/* Ürün Resmi */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getImageSrc(item)}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getImageSrc(item);
                      }}
                    />
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize mb-2">
                          {item.category}
                        </p>
                        <div className="text-xl font-bold text-blue-600">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Silme Butonu */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 ml-4"
                        title="Ürünü Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Miktar Kontrolü */}
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-sm text-gray-600">Miktar:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium border-x border-gray-300 min-w-[60px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-lg font-semibold text-gray-900 ml-auto">
                        Toplam: ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Sipariş Özeti
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Ürün Sayısı:</span>
                    <span>{totalItems} adet</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo:</span>
                    <span className="text-green-600">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>KDV:</span>
                    <span>${(totalPrice * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Toplam:</span>
                      <span>${(totalPrice * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
                >
                  Siparişi Tamamla
                </button>

                <button
                  onClick={() => (window.location.href = "/products")}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Alışverişe Devam Et
                </button>

                {/* Güvenlik Bilgileri */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600 text-sm">🔒</span>
                      </div>
                      <span className="text-xs text-gray-600">
                        Güvenli Ödeme
                      </span>
                    </div>
                    <div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 text-sm">🚚</span>
                      </div>
                      <span className="text-xs text-gray-600">
                        Hızlı Teslimat
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
