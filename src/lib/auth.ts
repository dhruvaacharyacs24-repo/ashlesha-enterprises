import { supabase } from "./supabase";

/**
 * Checks if the current authenticated user is an administrator.
 * Based on the strict requirement: email === ADMIN_EMAIL
 */
export async function isAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session || !session.user) {
    return false;
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  return session.user.email === adminEmail;
}

/**
 * Gets the current user profile from the database.
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}
