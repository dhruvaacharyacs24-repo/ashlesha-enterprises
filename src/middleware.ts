import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
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

  return response;
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
