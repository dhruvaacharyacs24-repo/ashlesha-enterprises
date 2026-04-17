"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, User, LogOut, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center p-2 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
             <ShoppingCart className="w-full h-full text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">ASHLESHA</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/products" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Store</Link>
          <div className="flex items-center gap-6 pl-10 border-l border-slate-800">
            <AnimatePresence mode="wait">
              {!user ? (
                <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Login</Link>
              ) : (
                <>
                  <Link href="/dashboard" className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-primary font-semibold flex items-center gap-1 text-sm">
                      <Settings className="w-4 h-4" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-bold ml-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative group">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 group-hover:text-primary transition-all">
                 <ShoppingCart className="w-5 h-5" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-950">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-400"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-t border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-sm font-bold text-slate-400">
              <Link href="/products" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Store</Link>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Order History</Link>
                  {isAdmin && <Link href="/admin" className="text-primary" onClick={() => setIsOpen(false)}>Admin Panel</Link>}
                  <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-500 transition-colors">Log Out</button>
                </>
              ) : (
                <Link href="/login" className="text-primary" onClick={() => setIsOpen(false)}>Login / Sign Up</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
