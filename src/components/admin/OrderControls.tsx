"use client";

import { updateOrderStatus, updatePaymentStatus } from "@/actions/orders";
import { useState } from "react";
import { Loader2, Check, RefreshCw } from "lucide-react";

export function OrderControls({ 
  orderId, 
  currentOrderStatus, 
  currentPaymentStatus 
}: { 
  orderId: string; 
  currentOrderStatus: string; 
  currentPaymentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(currentOrderStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);

  const handleOrderUpdate = async (newStatus: string) => {
    setLoading(true);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) setOrderStatus(newStatus);
    setLoading(false);
  };

  const handlePaymentUpdate = async (newStatus: string) => {
    setLoading(true);
    const res = await updatePaymentStatus(orderId, newStatus);
    if (res.success) setPaymentStatus(newStatus);
    setLoading(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Set Payment</label>
        <div className="flex items-center gap-2">
           <select
            value={paymentStatus}
            onChange={(e) => handlePaymentUpdate(e.target.value)}
            disabled={loading}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white outline-none focus:border-primary transition-all cursor-pointer"
          >
            <option value="PENDING" className="bg-slate-900 text-white">PENDING</option>
            <option value="VERIFYING" className="bg-slate-900 text-white">VERIFYING</option>
            <option value="PAID" className="bg-slate-900 text-white">PAID</option>
            <option value="FAILED" className="bg-slate-900 text-white">FAILED</option>
          </select>
          {loading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Set Progress</label>
        <div className="flex items-center gap-2">
          <select
            value={orderStatus}
            onChange={(e) => handleOrderUpdate(e.target.value)}
            disabled={loading}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white outline-none focus:border-primary transition-all cursor-pointer"
          >
            <option value="PENDING" className="bg-slate-900 text-white">PENDING</option>
            <option value="PROCESSING" className="bg-slate-900 text-white">PROCESSING</option>
            <option value="SHIPPED" className="bg-slate-900 text-white">SHIPPED</option>
            <option value="DELIVERED" className="bg-slate-900 text-white">DELIVERED</option>
            <option value="CANCELLED" className="bg-slate-900 text-white">CANCELLED</option>
          </select>
          {loading && <RefreshCw className="w-3 h-3 animate-spin text-primary" />}
        </div>
      </div>
    </div>
  );
}
