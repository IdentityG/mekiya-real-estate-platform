"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);

    try {
      // Create account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to create account");
        return;
      }

      // Auto sign in after successful signup
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Welcome to Mekiya!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-body font-bold uppercase tracking-wider text-graphite/70 mb-2"
        >
          Full Name
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          autoComplete="name"
          placeholder="John Doe"
          className={`w-full px-4 py-3 bg-white border ${
            errors.name ? "border-red-500" : "border-ink/10"
          } text-ink text-sm font-body placeholder-graphite/40 rounded-lg focus:outline-none focus:border-brass transition-colors`}
        />
        {errors.name && (
          <p className="text-red-600 text-xs font-body mt-1.5">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-body font-bold uppercase tracking-wider text-graphite/70 mb-2"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`w-full px-4 py-3 bg-white border ${
            errors.email ? "border-red-500" : "border-ink/10"
          } text-ink text-sm font-body placeholder-graphite/40 rounded-lg focus:outline-none focus:border-brass transition-colors`}
        />
        {errors.email && (
          <p className="text-red-600 text-xs font-body mt-1.5">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-body font-bold uppercase tracking-wider text-graphite/70 mb-2"
        >
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={`w-full px-4 py-3 bg-white border ${
            errors.password ? "border-red-500" : "border-ink/10"
          } text-ink text-sm font-body placeholder-graphite/40 rounded-lg focus:outline-none focus:border-brass transition-colors`}
        />
        {errors.password && (
          <p className="text-red-600 text-xs font-body mt-1.5">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-body font-bold uppercase tracking-wider text-graphite/70 mb-2"
        >
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          className={`w-full px-4 py-3 bg-white border ${
            errors.confirmPassword ? "border-red-500" : "border-ink/10"
          } text-ink text-sm font-body placeholder-graphite/40 rounded-lg focus:outline-none focus:border-brass transition-colors`}
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-xs font-body mt-1.5">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <p className="text-xs text-graphite/60 font-body">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="text-slate hover:text-brass">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-slate hover:text-brass">
          Privacy Policy
        </a>
        .
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-ink text-white text-sm font-body font-bold uppercase tracking-wider rounded-full hover:bg-brass hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
