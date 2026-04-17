"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Package, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl w-full p-12 md:p-20 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl text-center space-y-10 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center shadow-inner border border-primary/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase italic">Order Confirmed</h1>
          <p className="text-slate-400 font-medium max-w-sm mx-auto">
             Thank you for choosing Ashlesha Enterprises. We've received your order and will begin processing it immediately.
          </p>
        </div>

        {orderId && (
          <div className="bg-slate-950 border border-slate-800 px-10 py-5 rounded-2xl inline-block shadow-inner">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Order Tracking ID</p>
             <p className="text-xl font-black text-primary font-mono tracking-widest">{orderId}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-8">
          <Link
            href="/dashboard"
            className="px-8 py-5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95"
          >
            <Package className="w-5 h-5" /> Order Status
          </Link>
          <Link
            href="/"
            className="px-8 py-5 bg-slate-950 border border-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 pb-32 flex items-center justify-center">
      <Navbar />
      <Suspense fallback={
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Finalizing Order Details...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
