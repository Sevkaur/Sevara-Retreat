"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message);
        setLoading(false);
        return;
      }
      router.replace(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-20">
      <h1 className="font-[family-name:var(--font-anton)] text-3xl uppercase text-[#FFD1D1]">
        Admin login
      </h1>
      <p className="mt-2 font-[family-name:var(--font-inter)] text-sm text-black/80">
        Accesso riservato. Usa l&apos;account autorizzato (Supabase Auth).
      </p>
      {urlError === "config" ? (
        <p className="mt-3 text-sm text-amber-900" role="alert">
          Il server non ha la lista admin configurata. In{" "}
          <strong className="font-semibold">Vercel</strong> → progetto → Settings → Environment
          Variables aggiungi{" "}
          <code className="rounded bg-black/5 px-1 py-0.5 text-xs">ADMIN_ALLOWED_EMAILS</code>{" "}
          (es. <code className="rounded bg-black/5 px-1 py-0.5 text-xs">tua@email.com</code>) per
          Production, poi <strong className="font-semibold">Redeploy</strong>.
        </p>
      ) : null}
      {urlError === "forbidden" ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          Questo account non è nella lista autorizzata. Controlla che l&apos;email in{" "}
          <code className="rounded bg-black/5 px-1 py-0.5 text-xs">ADMIN_ALLOWED_EMAILS</code>{" "}
          coincida esattamente con quella dell&apos;account Supabase.
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black px-3 py-2 font-[family-name:var(--font-inter)]"
          />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Password</span>
          <div className="flex border border-black">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-w-0 flex-1 border-0 px-3 py-2 font-[family-name:var(--font-inter)] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Nascondi password" : "Mostra password"}
              className="shrink-0 border-l border-black bg-neutral-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-black hover:bg-neutral-200"
            >
              {showPassword ? "Nascondi" : "Mostra"}
            </button>
          </div>
        </div>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="border-0 bg-black px-4 py-3 font-bold uppercase tracking-wide text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center font-[family-name:var(--font-inter)] text-sm">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
