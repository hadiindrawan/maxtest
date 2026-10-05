import Link from "next/link";
import Character from "@/components/ui/Character";

const linkClass = "text-sm text-paper/60 transition-colors hover:text-primary";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline bg-ink px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 text-paper md:justify-start">
            <Character of={{ kind: "max", pose: "idle" }} variant="noexhaust" height={28} decorative />
            <span className="font-headline text-lg font-extrabold">maxtest</span>
          </div>
          <p className="text-sm text-paper/45">© {year} Maxtest AI Inc. All rights reserved.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link className={linkClass} href="/privacy">
            Privacy Policy
          </Link>
          <Link className={linkClass} href="/terms">
            Terms
          </Link>
          <a className={linkClass} href="https://linkedin.com/company/maxtestai" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
