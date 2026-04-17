"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2, ShieldCheck, Copy, Check, Info, Lock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { placeOrder } from "@/actions/orders";
import { Navbar } from "@/components/Navbar";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      router.push("/products");
    }
  }, [isAdmin, router]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      router.push("/cart");
    }
  }, [cart.length, step, router]);

  const paymentVPA = process.env.NEXT_PUBLIC_UPI_ID || "15dhruvaacharya@okicici";
  const upiLink = `upi://pay?pa=${paymentVPA}&pn=Ashlesha%20Enterprises&am=${cartTotal}&cu=INR&tn=Order%20Payment`;

  const copyVPA = () => {
    navigator.clipboard.writeText(paymentVPA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = async () => {
    if (!transactionId) {
      alert("Please enter your UPI transaction reference number.");
      return;
    }

    setLoading(true);
    const result = await placeOrder(
      { ...formData, userId: user?.id },
      cart,
      cartTotal,
      transactionId
    );

    if (result.success) {
      // Construct the FINAL professional WhatsApp message with Transaction ID
      const businessNumber = "919141082354";
      const itemsList = cart
        .map((item) => `• ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}`)
        .join("\n");

      const message = `*✅ PAYMENT COMPLETED & ORDER PLACED*\n*Ashlesha Enterprises*\n\n` +
        `*👤 Customer Details:*\n` +
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Address: ${formData.address}\n\n` +
        `*🛒 Ordered Items:*\n` +
        `${itemsList}\n\n` +
        `*💰 Total Amount: ${formatPrice(cartTotal)}*\n` +
        `*🔗 Transaction ID: ${transactionId}*\n\n` +
        `_Please verify this transaction in your business account._`;

      const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank");

      clearCart();
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    // Move to payment step in the current tab
    setStep(2);
  };

  if (cart.length === 0 && step !== 3) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-32 pb-32">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6">
        {/* Simple Progress Bar */}
        <div className="flex justify-between items-center mb-16 px-4">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20">1</div>
             <span className="text-sm font-bold text-slate-200 capitalize">Shipping</span>
          </div>
          <div className="flex-grow h-px bg-slate-800 mx-6" />
          <div className="flex items-center gap-4">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-800 text-slate-500"}`}>2</div>
             <span className={`text-sm font-bold capitalize ${step === 2 ? "text-slate-200" : "text-slate-500"}`}>Payment</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 md:p-16 space-y-12 shadow-2xl backdrop-blur-sm"
            >
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Shipping Information</h2>
                <p className="text-slate-400 font-medium">Please enter your delivery details below.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-standard bg-slate-950/50"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 ml-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input-standard bg-slate-950/50"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-bold text-slate-400 ml-1">Delivery Address</label>
                  <textarea
                    rows={4}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="input-standard bg-slate-950/50 resize-none"
                    placeholder="Street address, City, State, Pincode"
                  />
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!formData.name || !formData.phone || !formData.address}
                className="w-full btn-primary flex items-center justify-center gap-3 mt-8 shadow-xl shadow-primary/20"
              >
                Proceed to Payment <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-12"
            >
              <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 md:p-16 space-y-12 shadow-2xl backdrop-blur-sm">
                <div className="text-center space-y-6">
                   <div className="inline-flex p-4 bg-slate-950 text-primary rounded-3xl border border-slate-800 mb-2">
                     <Lock className="w-8 h-8" />
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold tracking-tight text-white">UPI Payment</h2>
                      <p className="text-slate-400 font-medium">Scan the QR code below using any UPI app.</p>
                   </div>
                </div>

                <div className="flex flex-col items-center gap-10">
                   <div className="bg-white p-6 border-2 border-slate-800 rounded-[2rem] shadow-2xl relative group">
                      <QRCodeSVG value={upiLink} size={220} level="H" includeMargin={false} />
                      <div className="absolute inset-x-0 -bottom-4 bg-primary text-white text-[10px] font-bold py-1 px-4 rounded-full text-center mx-12 shadow-md">
                         Scan with GPay/Paytm/PhonePe
                      </div>
                   </div>

                   <div className="text-center space-y-4">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or pay to UPI ID</p>
                      <button 
                        onClick={copyVPA}
                        className="flex items-center gap-4 bg-slate-950 px-8 py-4 rounded-xl border border-slate-800 hover:border-primary transition-all group"
                      >
                        <span className="text-lg font-bold text-slate-100">{paymentVPA}</span>
                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-slate-600 group-hover:text-primary" />}
                      </button>
                   </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-slate-800">
                   <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-slate-500" />
                      <span className="text-sm font-bold text-slate-300">Enter Payment Reference Number</span>
                   </div>
                   <input
                    type="text"
                    placeholder="Enter 12-digit UPI reference ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="input-standard bg-slate-950/50 text-center font-bold text-xl tracking-wider text-white"
                  />
                </div>

                <div className="flex gap-4 pt-12">
                   <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                   <button 
                    onClick={handleFinalize}
                    disabled={loading || !transactionId}
                    className="btn-primary flex-[2] flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                   >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Order <ArrowRight className="w-5 h-5" /></>}
                   </button>
                </div>
              </div>

              <div className="md:col-span-4 space-y-6">
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-sm">
                    <h3 className="font-bold text-white border-b border-slate-800 pb-4">In your cart</h3>
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                           <div className="flex-grow">
                              <p className="text-sm font-bold text-slate-200 line-clamp-1">{item.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Qty: {item.quantity}</p>
                           </div>
                           <p className="text-sm font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-slate-800 flex justify-between items-center font-bold">
                       <span className="text-sm text-slate-400">Total</span>
                       <span className="text-xl text-primary">{formatPrice(cartTotal)}</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
