import Link from "next/link";
import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "Sign In",
    description: "Maxtest sign in and registration are temporarily closed while we build something big.",
    path: "/login",
  }),
  robots: { index: false, follow: false },
};

const field =
  "h-11 w-full cursor-not-allowed rounded-lg border-2 border-hairline bg-panel px-4 text-paper opacity-50 placeholder:text-paper/40";
const label = "mb-1 block text-sm font-bold text-paper/80";
const disabledButton =
  "h-11 w-full cursor-not-allowed rounded-lg border-2 border-hairline text-sm font-bold opacity-50";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-paper">Sign in</h1>
        <p className="mt-2 text-paper/70">Access your Maxtest account.</p>

        <div role="status" className="mt-6 rounded-lg border-2 border-primary bg-primary/10 p-4 text-sm text-paper">
          <p className="mb-1 font-bold text-primary">We&apos;re building something big</p>
          <p>
            Sign in and registration are temporarily closed while we work on what&apos;s next. Thank you for your
            patience, we&apos;ll be back soon.
          </p>
        </div>

        <form aria-disabled="true" className="mt-6">
          <fieldset disabled className="space-y-4">
            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input id="email" type="email" placeholder="you@example.com" className={field} />
            </div>
            <div>
              <label htmlFor="password" className={label}>
                Password
              </label>
              <input id="password" type="password" placeholder="Password" className={field} />
            </div>
            <button type="submit" className={`${disabledButton} border-paper bg-primary text-ink`}>
              Sign in
            </button>
            <div className="grid grid-cols-2 gap-3">
              {["Google", "GitHub"].map((provider) => (
                <button key={provider} type="button" className={`${disabledButton} text-paper`}>
                  {provider}
                </button>
              ))}
            </div>
          </fieldset>
        </form>

        <p className="mt-6 text-center text-sm text-paper/60">
          Registration is closed for now.{" "}
          <Link href="/" className="font-bold text-primary hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
