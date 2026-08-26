import type { Metadata } from "next";
import { SignInForm } from "@/components/admin/SignInForm";

/**
 * Admin sign-in page (Task 12.4).
 * Reachable directly at /admin/sign-in. Not linked from the public site.
 * noindex so it stays out of search engines.
 */
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">
          Admin
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-ink">
          Sign in to manage content
        </h1>
        <div className="mt-10">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
