"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          autoComplete="current-password"
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

      {/* Forgot Password Link */}
      <div className="text-right">
        <a
          href="#"
          className="text-xs font-body text-slate hover:text-brass transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-ink text-white text-sm font-body font-bold uppercase tracking-wider rounded-full hover:bg-brass hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
