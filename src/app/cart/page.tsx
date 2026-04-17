"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 pb-32">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Shopping Cart</h1>
          <p className="text-slate-400 font-medium">Review your items before you checkout.</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 p-24 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-8 backdrop-blur-sm">
            <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center text-slate-800 border border-slate-800">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
              <p className="text-slate-500 font-medium">Looks like you haven't added anything yet.</p>
            </div>
            <Link
              href="/products"
              className="px-10 py-5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              Browse Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8 group backdrop-blur-sm"
                  >
                    <div className="w-24 h-24 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-80" />
                      )}
                    </div>

                    <div className="flex-grow space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.category}</p>
                      <h3 className="text-xl font-bold text-white">{item.name}</h3>
                      <p className="text-sm font-bold text-slate-500">Unit Price: {formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-900 rounded-lg transition-colors text-slate-400 hover:text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-slate-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 hover:bg-slate-900 rounded-lg transition-colors text-slate-400 hover:text-white disabled:opacity-10"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-6 min-w-[120px]">
                      <p className="text-xl font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-700 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 sticky top-32 shadow-2xl">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
                
                <div className="space-y-4 pt-4 border-t border-slate-800 font-medium">
                   <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-slate-200">{formatPrice(cartTotal)}</span>
                   </div>
                   <div className="flex justify-between text-slate-400">
                      <span>Shipping</span>
                      <span className="text-blue-400">Calculated later</span>
                   </div>
                </div>

                 <div className="pt-8 border-t border-slate-800">
                    <div className="flex justify-between items-end mb-8">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total cost</span>
                       <span className="text-4xl font-black text-white tracking-tighter">{formatPrice(cartTotal)}</span>
                    </div>
                    
                    {!isAdmin ? (
                      <Link
                       href="/checkout"
                       className="w-full btn-primary py-5 rounded-xl flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-primary/20"
                      >
                        Checkout Now <ArrowRight className="w-5 h-5" />
                      </Link>
                    ) : (
                      <div className="w-full py-5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          Checkout Disabled (Admin)
                        </p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
