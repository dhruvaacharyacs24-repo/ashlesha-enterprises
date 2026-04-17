import { createClient } from "@/lib/supabaseServer";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { ShoppingBag, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: products, error } = await query;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-20 pb-32">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Simple Page Header */}
        <div className="bg-slate-900/40 p-10 border border-slate-800 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 backdrop-blur-sm">
           <div className="space-y-2 text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                {category ? category.replace("_", " ") : "All Products"}
              </h1>
              <p className="text-slate-400 font-medium">Browse our full collection of premium materials.</p>
           </div>
           
           <div className="flex items-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <span>{products?.length || 0} items found</span>
           </div>
        </div>

        {/* Standard Grid */}
        {!products || products.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-800 py-40 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6">
            <ShoppingBag className="w-16 h-16 text-slate-800" />
            <div className="space-y-2">
               <h2 className="text-2xl font-bold text-slate-100">No products found</h2>
               <p className="text-slate-500 font-medium">Try checking another category or come back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
