import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowedAdminEmail, parseAdminAllowlist } from "@/lib/admin-allowlist";

function adminGateError(): "config" | "forbidden" {
  return parseAdminAllowlist().size === 0 ? "config" : "forbidden";
}

function redirectToLogin(request: NextRequest, error?: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.delete("redirect");
  if (error) {
    url.searchParams.set("error", error);
  }
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAllowedAdminEmail(user.email)) {
      await supabase.auth.signOut();
      return redirectToLogin(request, adminGateError());
    }
  }

  if (request.nextUrl.pathname === "/login") {
    if (user) {
      if (isAllowedAdminEmail(user.email)) {
        const dest = request.nextUrl.clone();
        dest.pathname = "/admin";
        dest.searchParams.delete("redirect");
        return NextResponse.redirect(dest);
      }
      await supabase.auth.signOut();
      return redirectToLogin(request, adminGateError());
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
