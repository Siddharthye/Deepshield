"use client";

import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl items-center px-4 py-10 md:py-16">
      <AuthForm />
    </div>
  );
}
