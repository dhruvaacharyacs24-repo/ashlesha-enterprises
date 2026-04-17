import { createClient } from "@/lib/supabaseServer";
import { Navbar } from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin, Phone, Mail, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; label: string }> = {
    PENDING: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Pending" },
    PROCESSING: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Processing" },
    SHIPPED: { color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", label: "Shipped" },
    DELIVERED: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Delivered" },
    CANCELLED: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Cancelled" },
    VERIFYING: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Verifying Payment" },
    PAID: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Paid" },
    FAILED: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Payment Failed" },
  };

  const config = configs[status] || { color: "bg-slate-500/10 text-slate-400 border-slate-500/20", label: status };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
      {config.label}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="bg-slate-900 p-12 rounded-3xl shadow-xl border border-slate-800 text-center space-y-4">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
           <p className="font-bold text-white">Please login to view your orders.</p>
        </div>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 pb-32">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">My Orders</h1>
              <p className="text-slate-400 font-medium">Tracking and history for your purchases.</p>
           </div>
           <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                 <User className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                 <p className="text-sm font-bold text-slate-200">{session.user.email}</p>
              </div>
           </div>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 p-24 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-8 backdrop-blur-sm">
            <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center text-slate-800 border border-slate-800">
              <Package className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">No orders yet</h2>
              <p className="text-slate-500 font-medium">When you buy something, it will appear here.</p>
            </div>
            <Link
              href="/products"
              className="px-10 py-5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm"
              >
                <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-10">
                  <div className="space-y-8 flex-grow">
                    <div className="flex flex-wrap items-center gap-4">
                      <StatusBadge status={order.order_status} />
                      <StatusBadge status={order.payment_status} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID: {order.id.slice(0, 8)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <MapPin className="w-3 h-3" /> Shipping Address
                          </p>
                          <p className="text-sm font-medium text-slate-300 leading-relaxed">{order.address}</p>
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Items</p>
                          <div className="space-y-2">
                             {order.order_items?.map((item: any) => (
                               <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                                  <span className="text-slate-400">{item.name} <span className="text-primary/60 ml-px">x{item.quantity}</span></span>
                                  <span className="text-slate-200">{formatPrice(item.price * item.quantity)}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="md:w-64 flex flex-col justify-between items-end gap-10 md:border-l border-slate-800 md:pl-10">
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount Paid</p>
                      <p className="text-3xl font-black text-white">{formatPrice(order.total_amount)}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 w-full text-center">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transaction ID</p>
                       <p className="text-xs font-mono font-bold text-blue-400 truncate">{order.transaction_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
