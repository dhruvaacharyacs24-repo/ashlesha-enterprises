"use server";

import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function placeOrder(formData: any, cartItems: any[], totalAmount: number, transactionId: string) {
  const supabase = await createClient();
  try {
    // 1. Verify stock for all items
    const { data: latestProducts, error: fetchError } = await supabase
      .from("products")
      .select("id, stock, name")
      .in("id", cartItems.map(item => item.id));
    
    if (fetchError) throw new Error("Could not verify stock levels.");

    for (const item of cartItems) {
      const product = latestProducts.find(p => p.id === item.id);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}.`);
      }
    }

    // 2. Create the Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: formData.userId || null,
          user_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          total_amount: totalAmount,
          transaction_id: transactionId,
          payment_status: "VERIFYING",
          order_status: "PENDING"
        }
      ])
      .select();

    if (orderError) {
      if (orderError.code === "23505") {
        throw new Error("This Transaction ID has already been used for another order.");
      }
      throw orderError;
    }

    const orderId = order[0].id;

    // 3. Create Order Items
    const orderItems = cartItems.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // DEFERRED: Stock decrement was removed from here. 
    // It will now only happen when payment_status is set to "PAID" by an admin.

    // Comprehensive Revalidation
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/dashboard");
    revalidatePath("/products");
    
    return { success: true, orderId: orderId };
  } catch (error: any) {
    console.error("Order Action Error:", error);
    return { success: false, error: error.message || "An unexpected error occurred while placing your order." };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", orderId);
    
    if (error) throw error;

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePaymentStatus(orderId: string, status: string) {
  const supabase = await createClient();
  try {
    // 1. Fetch current order to check previous status
    const { data: order, error: orderFetchError } = await supabase
      .from("orders")
      .select("payment_status")
      .eq("id", orderId)
      .single();

    if (orderFetchError) throw orderFetchError;

    const previousStatus = order.payment_status;

    // 2. Update the status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("id", orderId);
    
    if (updateError) throw updateError;

    // 3. Trigger stock sync only when transitioning TO or FROM "PAID"
    if ((status === "PAID" && previousStatus !== "PAID") || (status !== "PAID" && previousStatus === "PAID")) {
      const isIncrement = status !== "PAID"; // If moving AWAY from paid, we add stock back

      // Fetch items for this order
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);
      
      if (itemsError) throw itemsError;

      for (const item of items) {
        // Fetch current stock
        const { data: product, error: pError } = await supabase
          .from("products")
          .select("stock, name")
          .eq("id", item.product_id)
          .single();
        
        if (pError) throw pError;

        // Apply adjustment
        const newStock = isIncrement 
          ? product.stock + item.quantity 
          : product.stock - item.quantity;

        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product_id);
        
        if (stockError) throw new Error(`Failed to sync stock for ${product.name}`);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/dashboard");
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    console.error("Payment Update Error:", error);
    return { success: false, error: error.message };
  }
}
