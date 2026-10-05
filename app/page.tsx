import CastSection from "@/components/home/CastSection";
import ConnectBlock from "@/components/home/ConnectBlock";
import ControlSection from "@/components/home/ControlSection";
import DashboardSection from "@/components/home/DashboardSection";
import FinalCta from "@/components/home/FinalCta";
import Hero from "@/components/home/Hero";
import PricingTeaser from "@/components/home/PricingTeaser";
import { signupUrl } from "@/lib/links";
import { buildConnectCommand } from "@/lib/mcp-command";

export default function Home() {
  const connect = buildConnectCommand(process.env.NEXT_PUBLIC_MCP_URL);
  if (!connect.configured) {
    console.warn("[home] NEXT_PUBLIC_MCP_URL is not set; the connect command shows a placeholder host.");
  }
  const signupHref = signupUrl();

  return (
    <div className="min-h-screen bg-ink">
      <Hero signupHref={signupHref} />
      <ConnectBlock command={connect.command} endpoint={connect.endpoint} />
      <CastSection />
      <ControlSection />
      <DashboardSection />
      <PricingTeaser />
      <FinalCta signupHref={signupHref} />
    </div>
  );
}
