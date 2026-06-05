import { redirect } from "next/navigation";
import { safeReturnPath } from "@/lib/googleOAuth";

type Props = {
  searchParams: Promise<{ from?: string }>;
};

/** Legacy OAuth landing page — forwards to the server finalize handler. */
export default async function AuthCompletePage({ searchParams }: Props) {
  const { from } = await searchParams;
  const returnTo = safeReturnPath(from ?? null);
  redirect(`/api/auth/finalize?from=${encodeURIComponent(returnTo)}`);
}
