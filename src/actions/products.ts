"use server";

import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function addProduct(data: {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}) {
  const supabase = await createClient();
  try {
    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
          image_url: data.imageUrl,
        },
      ])
      .select();

    if (error) throw error;

    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, product: product[0] };
  } catch (error: any) {
    console.error("Add Product Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  const supabase = await createClient();
  try {
    const { data: product, error } = await supabase
      .from("products")
      .update({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image_url: data.imageUrl,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { success: true, product: product[0] };
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return { success: false, error: error.message };
  }
}
