"use client";

import { useState, useEffect } from "react";
import { deleteProduct } from "@/actions/products";
import { Navbar } from "@/components/Navbar";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { formatPrice } from "@/lib/utils";
import { Plus, Trash2, ArrowLeft, Loader2, Package, Layers } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [showAddForm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert(res.error);
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 pb-32">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Header Section */}
        <div className="bg-slate-900 border border-slate-800 p-10 md:p-14 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-12 backdrop-blur-sm">
           <div className="space-y-4 text-center md:text-left">
              <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                 <ArrowLeft className="w-4 h-4" /> Back to Orders
              </Link>
              <h1 className="text-5xl font-extrabold tracking-tight text-white">Product Catalog</h1>
              <p className="text-slate-400 font-medium">Add, edit, or remove products from your store inventory.</p>
           </div>
           
           <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-3 shadow-xl shadow-primary/20 bg-primary hover:bg-primary-dark transition-all px-8 py-4 rounded-xl font-bold text-white"
            >
              Add New Product <Plus className="w-5 h-5" />
            </button>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center space-y-4">
               <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
               <p className="text-sm text-slate-500 font-medium tracking-widest uppercase">Fetching Catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 py-40 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6">
              <Package className="w-16 h-16 text-slate-800" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">No products found</h2>
                <p className="text-slate-500 font-medium">Click "Add New Product" to start building your catalog.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
               {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    className="bg-slate-900/50 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-8 hover:bg-slate-900 transition-all backdrop-blur-sm"
                  >
                     <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="w-24 h-28 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800 shadow-inner">
                           {product.image_url ? (
                              <img src={product.image_url} className="w-full h-full object-cover opacity-80" alt="" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-800"><Package className="w-8 h-8" /></div>
                           )}
                        </div>
                        <div className="text-center sm:text-left space-y-3">
                           <div className="flex items-center justify-center sm:justify-start gap-3">
                              <span className="px-3 py-1 bg-slate-950 text-primary text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-800">
                                {product.category}
                              </span>
                              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${product.stock > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                              </span>
                           </div>
                           <h3 className="text-2xl font-black text-white tracking-tight">{product.name}</h3>
                           <div className="flex flex-wrap justify-center sm:justify-start items-center gap-8 text-sm font-bold">
                              <div className="flex flex-col">
                                 <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Stock Level</span>
                                 <span className="text-slate-200">{product.stock} units</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Price Point</span>
                                 <span className="text-primary">{formatPrice(product.price)}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-4 bg-slate-950 text-slate-600 rounded-xl hover:bg-red-500 hover:text-white border border-slate-800 transition-all active:scale-95 disabled:opacity-50"
                          title="Delete Product"
                        >
                           {deletingId === product.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddForm(false)}
                className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md"
             />
             <AddProductForm onClose={() => setShowAddForm(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
