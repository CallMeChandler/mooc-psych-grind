import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInPanel from "@/components/SignInPanel";
import { authOptions } from "@/lib/auth";

type SignInSearchParams = Promise<Record<string, string | string[] | undefined>>;

function normalizeCallbackUrl(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "/weeks";

  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }

  try {
    const parsed = new URL(raw);
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/weeks";
  } catch {
    return "/weeks";
  }
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SignInSearchParams;
}) {
  const params = await searchParams;
  const callbackUrl = normalizeCallbackUrl(params.callbackUrl);
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <SignInPanel
      google={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
      github={Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET)}
      callbackUrl={callbackUrl}
    />
  );
}
