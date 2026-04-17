"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        // Immediate redirect based on role
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim();
        const isLoggingInAsAdmin = formData.email.trim().toLowerCase() === adminEmail?.toLowerCase();
        
        if (isLoggingInAsAdmin) {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
        // We don't set loading to false here because we're navigating away
      } else {
        alert(result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Login unexpected error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col pt-16">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-10 md:p-14 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-10 relative z-10">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-2">
                 <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Login to your account</h1>
              <p className="text-sm font-medium text-slate-400">
                Welcome back! Please enter your details below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-400 ml-1">Email Address</label>
                   <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-standard bg-slate-950/50"
                    placeholder="name@example.com"
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-400 ml-1">Password</label>
                   <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="input-standard bg-slate-950/50"
                    placeholder="••••••••"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                suppressHydrationWarning
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log In <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>

            <div className="pt-8 border-t border-slate-800/50 text-center text-sm font-medium">
               <p className="text-slate-400">
                  New here? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
               </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
