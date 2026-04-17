"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const { isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const cartItem = cart.find(item => item.id === product.id);
  const currentInCart = cartItem?.quantity || 0;
  const availableStock = product.stock - currentInCart;

  const handleAdd = () => {
    setAdding(true);
    const result = addToCart(product, quantity);
    if (!result.success) {
      alert(result.message);
    }
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-primary/5 transition-all group backdrop-blur-sm">
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-800">
             <ShoppingCart className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-4 left-4 px-3 py-1 bg-slate-950/80 backdrop-blur border border-slate-800 shadow-sm rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {product.category}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-grow flex flex-col gap-5">
        <div className="space-y-2">
           <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary transition-colors leading-tight">
             {product.name}
           </h3>
           <p className="text-sm text-slate-400 line-clamp-2 font-medium leading-relaxed">
             {product.description}
           </p>
        </div>

        <div className="mt-auto flex items-end justify-between">
            <div className="space-y-1">
               <p className="text-2xl font-black text-white">{formatPrice(product.price)}</p>
               <p className={`text-[10px] font-bold uppercase tracking-wider ${availableStock > 0 ? "text-blue-400" : "text-red-400"}`}>
                  {availableStock > 0 ? `${availableStock} in stock` : "Out of Stock"}
               </p>
            </div>
        </div>

        {/* Action Controls - Hidden for Admins */}
        {!isAdmin ? (
          <div className="pt-2 flex gap-3">
            <div className="flex items-center gap-1 bg-slate-950 rounded-xl p-1 border border-slate-800">
               <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-slate-900 rounded-lg transition-colors text-slate-400 hover:text-white"
                  title="Decrease"
               >
                  <Minus className="w-3.5 h-3.5" />
               </button>
               <span className="w-8 text-center text-sm font-bold text-slate-200">{quantity}</span>
               <button 
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="p-2 hover:bg-slate-900 rounded-lg transition-colors text-slate-400 hover:text-white disabled:opacity-10"
                  title="Increase"
               >
                  <Plus className="w-3.5 h-3.5" />
               </button>
            </div>
            
            <button
              onClick={handleAdd}
              disabled={availableStock <= 0 || adding}
              className="flex-grow btn-primary py-4 text-[10px] uppercase tracking-widest"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ) : (
          <div className="pt-2">
            <div className="w-full py-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Management Mode
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
