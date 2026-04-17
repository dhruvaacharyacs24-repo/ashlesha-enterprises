"use client";

import { addProduct } from "@/actions/products";
import { useState } from "react";
import { Plus, Loader2, X, Image as ImageIcon, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export function AddProductForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "PLYWOOD",
    stock: "",
    imageUrl: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, imageUrl: publicUrl });
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await addProduct({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    });
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      alert(res.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900 p-10 md:p-14 rounded-[2.5rem] border border-slate-800 w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh] backdrop-blur-xl"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 hover:bg-slate-800 rounded-full transition-all text-slate-500 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase tracking-wider">Add New Product</h2>
          <p className="text-slate-500 font-medium text-sm">Populate the catalog with premium hardware and industrial materials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="font-black text-slate-500 uppercase tracking-widest ml-1">Product Identity</label>
              <input
                required
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-standard bg-slate-950 border-slate-800 text-slate-200 focus:border-primary"
              />
            </div>
            
            <div className="space-y-3">
              <label className="font-black text-slate-500 uppercase tracking-widest ml-1">Classification</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="input-standard appearance-none bg-slate-950 border-slate-800 text-slate-200 focus:border-primary"
              >
                <option value="PLYWOOD" className="bg-slate-950 text-slate-200">Plywood</option>
                <option value="DOORS" className="bg-slate-950 text-slate-200">Doors</option>
                <option value="FURNITURE" className="bg-slate-950 text-slate-200">Furniture</option>
                <option value="FISHING_TOOLS" className="bg-slate-950 text-slate-200">Tools</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="font-black text-slate-500 uppercase tracking-widest ml-1">Valuation (INR)</label>
              <input
                required
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="input-standard bg-slate-950 border-slate-800 text-slate-200 focus:border-primary"
              />
            </div>

            <div className="space-y-3">
              <label className="font-black text-slate-500 uppercase tracking-widest ml-1">Initial Stock</label>
              <input
                required
                type="number"
                placeholder="Unit count"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="input-standard bg-slate-950 border-slate-800 text-slate-200 focus:border-primary"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="font-black text-slate-500 uppercase tracking-widest ml-1">Product Brief</label>
              <textarea
                required
                rows={3}
                placeholder="Technical specifications and material details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-standard bg-slate-950 border-slate-800 text-slate-200 focus:border-primary resize-none"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="font-black text-slate-500 uppercase tracking-widest ml-1">Media Assets</label>
              <div className="flex flex-col gap-6">
                 {formData.imageUrl ? (
                   <div className="relative w-full h-56 bg-slate-950 rounded-3xl overflow-hidden group border border-slate-800 shadow-inner">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        className="absolute top-6 right-6 p-2.5 bg-slate-900 border border-slate-800 shadow-2xl rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                         <X className="w-4 h-4" />
                      </button>
                   </div>
                 ) : (
                   <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-800 bg-slate-950 rounded-[2.5rem] cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                          <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mb-4 border border-slate-800 transition-colors group-hover:text-primary">
                               <Upload className="w-8 h-8" />
                            </div>
                            <p className="mb-2 text-sm text-slate-400 font-bold"><span className="text-white">Upload Asset</span></p>
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">PNG or WEBP Optimized</p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                   </label>
                 )}
                 <div className="relative pt-4 border-t border-slate-800">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mb-4 text-center">External Resource Logic</p>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                      <input
                        type="text"
                        placeholder="Reference image URL directly"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="input-standard bg-slate-950 border-slate-800 text-slate-200 pl-12 h-14"
                      />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full btn-primary flex items-center justify-center gap-4 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mt-6 shadow-2xl shadow-primary/20 transform active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Commit Product Catalog <Plus className="w-5 h-5 text-white/50" /></>}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
