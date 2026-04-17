"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Drill, Sofa, DoorOpen, Hammer, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const categories = [
  {
    name: "Premium Plywood",
    icon: <Drill className="w-6 h-6" />,
    href: "/products?category=PLYWOOD",
    desc: "Quality sheets for furniture and construction.",
  },
  {
    name: "Modern Doors",
    icon: <DoorOpen className="w-6 h-6" />,
    href: "/products?category=DOORS",
    desc: "Stylish and durable entryway solutions.",
  },
  {
    name: "Living Furniture",
    icon: <Sofa className="w-6 h-6" />,
    href: "/products?category=FURNITURE",
    desc: "Bespoke furniture for your home and office.",
  },
  {
    name: "Hardware Tools",
    icon: <Hammer className="w-6 h-6" />,
    href: "/products?category=FISHING_TOOLS",
    desc: "Essential tools for any crafting project.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-16">
      <Navbar />
      
      <main>
        {/* Simple Hero Section */}
        <section className="relative bg-[#020617] py-20 lg:py-40 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  Ashlesha Enterprises
                </span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                Precision. <br />
                <span className="text-primary">Strength.</span> <br />
                Quality.
              </h1>
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
                Supplying premium industrial materials with a commitment to durability. Experience the elite standard in plywood, doors, and furniture.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <Link
                  href="/products"
                  className="bg-primary text-white font-bold px-12 py-6 rounded-2xl hover:bg-primary-dark transition-all flex items-center gap-3 shadow-2xl shadow-primary/40 active:scale-95"
                >
                  Shop Catalog <ArrowRight className="w-6 h-6" />
                </Link>
                <Link
                  href="/login"
                  className="bg-slate-900 border border-slate-800 text-white font-bold px-12 py-6 rounded-2xl hover:bg-slate-800 transition-all border-b-4 border-b-slate-800 active:border-b-0 active:translate-y-1"
                >
                  Join the Elite
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative hidden lg:block"
            >
               <div className="aspect-[4/5] bg-slate-900 shadow-2xl rounded-[4rem] overflow-hidden p-4 border border-slate-800 group relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10 opacity-60" />
                  <img 
                    src="/images/hero-plywood.png" 
                    className="w-full h-full object-cover rounded-[3rem] transition-transform duration-1000 group-hover:scale-110" 
                    alt="Premium Merchant Plywood" 
                  />
                  <div className="absolute bottom-12 left-12 right-12 z-20 space-y-4">
                     <div className="flex items-center gap-4 bg-slate-950/90 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                           <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-white text-xl tracking-tight">Premium Grade</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Certified & Durable</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-24 bg-slate-950 border-y border-slate-900">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: <Truck />, title: "Rapid Logistics", desc: "Express shipping across the region." },
                { icon: <ShieldCheck />, title: "Secure Checkout", desc: "Encrypted UPI-based payments." },
                { icon: <CreditCard />, title: "Unbeatable Value", desc: "Factory prices on all materials." }
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-6 group">
                   <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary border border-slate-800 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      {feat.icon}
                   </div>
                   <div>
                      <h3 className="font-bold text-white text-lg tracking-tight">{feat.title}</h3>
                      <p className="text-sm text-slate-500 font-medium">{feat.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="space-y-4">
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Explore Range</span>
               <h2 className="text-5xl font-black text-white tracking-tighter">Handpicked <br /> Collections</h2>
            </div>
            <Link href="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all pb-2 border-b-2 border-primary/20 hover:border-primary">
               View Full Catalog <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={cat.href}
                  className="group relative bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:bg-slate-900 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-primary border border-slate-800 shadow-xl group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 mb-8 relative z-10">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors relative z-10 tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium relative z-10">
                    {cat.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="bg-slate-950 text-slate-400 py-32 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white tracking-tighter">ASHLESHA.</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Elite supplier of industrial grade plywood, architectural doors, and bespoke furniture solutions. 
            </p>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.2em]">Inventory</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/products?category=PLYWOOD" className="hover:text-primary transition-colors">Plywood</Link></li>
              <li><Link href="/products?category=DOORS" className="hover:text-primary transition-colors">Doors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.2em]">Account</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Order Tracking</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.2em]">HQ</h4>
            <div className="space-y-4 text-sm font-bold">
              <p className="text-slate-300">Gangolli, KA, India <br /> Pin - 576216</p>
              <p className="text-primary text-xl font-black">+91 91410 82354</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
           <p>© 2024 Ashlesha Enterprises</p>
           <p>Midnight Elite Edition</p>
        </div>
      </footer>
    </div>
  );
}
