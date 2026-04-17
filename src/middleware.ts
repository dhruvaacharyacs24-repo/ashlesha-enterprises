import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const protectedPaths = ["/products", "/cart", "/checkout", "/dashboard", "/admin"];
  const isProtected = protectedPaths.some((path) => url.pathname.startsWith(path));

  // Redirect unauthenticated users to login
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin protection
  if (url.pathname.startsWith("/admin") && user) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim();
    if (user.email !== adminEmail) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/products/:path*", 
    "/cart/:path*", 
    "/checkout/:path*", 
    "/dashboard/:path*", 
    "/admin/:path*"
  ],
};
