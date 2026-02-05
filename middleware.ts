import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // ۱. ایجاد یک پاسخ اولیه
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ۲. راه‌اندازی سوپابیس با مدیریت صحیح کوکی‌ها
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // این بخش حیاتی است: کوکی‌ها هم در درخواست و هم در پاسخ ست می‌شوند
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ۳. گرفتن یوزر (حتماً از getUser استفاده کن)
  const { data: { user } } = await supabase.auth.getUser();

  // ۴. منطق ریدایرکت
  if (!user && request.nextUrl.pathname.startsWith("/payment")) {
    const url = request.nextUrl.clone();
    url.pathname = "/signup";
    url.searchParams.set("returnUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/payment/:path*", "/profile/:path*", "/dashboard/:path*"],
};