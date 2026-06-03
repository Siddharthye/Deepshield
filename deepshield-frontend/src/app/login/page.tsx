"use client";

import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

function LoginFallback() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center px-4">
      <div className="h-10 w-10 animate-pulse rounded-full bg-cream-tan/80" aria-hidden />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center px-4 py-6 pb-10 md:py-12">
      <Suspense fallback={<LoginFallback />}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
