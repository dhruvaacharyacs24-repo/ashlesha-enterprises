import { createClient } from "@/lib/supabaseServer";
import { Navbar } from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import { OrderControls } from "@/components/admin/OrderControls";
import { ShieldAlert, Package, LayoutDashboard, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 pb-32">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Admin Header */}
        <div className="bg-slate-900 border border-slate-800 p-10 md:p-16 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-12 backdrop-blur-sm">
           <div className="space-y-4 text-center md:text-left">
              <span className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">Admin Dashboard</span>
              <h1 className="text-5xl font-extrabold tracking-tight text-white">Order Management</h1>
              <p className="text-slate-400 font-medium">Review and process customer orders from across the store.</p>
           </div>
           
           <div className="flex gap-4">
              <Link 
                href="/admin/products"
                className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                Manage Products <Package className="w-4 h-4" />
              </Link>
           </div>
        </div>

        {/* Orders Feed */}
        {!orders || orders.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 p-40 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-8">
            <Search className="w-16 h-16 text-slate-800" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">No orders found</h2>
              <p className="text-slate-500 font-medium">New orders will appear here as customers place them.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 space-y-10 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-8 border-b border-slate-800 pb-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order Reference</p>
                      <div className="flex flex-wrap items-center gap-4">
                         <span className="text-sm font-mono font-bold text-slate-200">{order.id.slice(0, 12)}...</span>
                         <span className="px-3 py-1 bg-slate-950 text-blue-400 text-[10px] font-bold rounded-md border border-slate-800">
                            UPI Ref: {order.transaction_id || "None"}
                         </span>
                      </div>
                   </div>
                   
                   <OrderControls 
                      orderId={order.id} 
                      currentOrderStatus={order.order_status} 
                      currentPaymentStatus={order.payment_status}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {/* Items & Customer Info */}
                   <div className="space-y-10">
                      <div className="space-y-6">
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Details</h3>
                         <div className="space-y-1">
                            <p className="text-xl font-bold text-white">{order.user_name}</p>
                            <p className="text-sm font-medium text-slate-400">{order.email}</p>
                            <p className="text-sm font-medium text-slate-400">{order.phone}</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordered Items</h3>
                         <div className="space-y-3">
                            {order.order_items?.map((item: any) => (
                               <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                                  <span className="text-slate-400">{item.name} <span className="text-primary/60 ml-1">x{item.quantity}</span></span>
                                  <span className="text-slate-200">{formatPrice(item.price * item.quantity)}</span>
                               </div>
                            ))}
                            <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center font-black">
                               <span className="text-slate-400 uppercase text-[10px] tracking-widest">Revenue</span>
                               <span className="text-2xl text-white">{formatPrice(order.total_amount)}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Shipping Details */}
                   <div className="space-y-6">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shipping Address</h3>
                      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                         <p className="text-sm font-medium leading-relaxed text-slate-300">
                            {order.address}
                         </p>
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
