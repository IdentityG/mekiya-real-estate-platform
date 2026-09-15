import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — Mekiya Real Estate",
  description: "Sign in to your Mekiya Real Estate account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-graphite to-ink flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-display text-4xl text-brass tracking-tight">
              Mekiya
            </h1>
            <p className="text-white/50 text-sm font-body mt-1">
              Real Estate Platform
            </p>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-linen border border-ink/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="font-display text-2xl text-ink tracking-tight">
              Welcome back
            </h2>
            <p className="text-graphite/60 text-sm font-body mt-1">
              Sign in to access your account
            </p>
          </div>

          <LoginForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-linen px-2 text-graphite/50 font-body">
                New to Mekiya?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="block w-full text-center py-3 border border-ink/20 text-ink text-sm font-body font-semibold rounded-full hover:bg-cream transition-colors"
          >
            Create an account
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/60 text-sm font-body hover:text-brass transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
