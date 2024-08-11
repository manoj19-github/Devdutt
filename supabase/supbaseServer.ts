import { CookieOptions, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function supabaseServerClient() {
  const CookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return CookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          CookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          CookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
  //   supabase.auth.getUser()

  return supabase;
}
