import PortfolioShell from "@/components/Layouts/PortfolioShell";

export default function PrivacyPage() {
  return (
    <PortfolioShell>
      <div className="max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold">Privacy</h1>
        <p className="text-base leading-7">
          No cookies. Self-hosted fonts. No third-party requests on first load.
        </p>
      </div>
    </PortfolioShell>
  );
}
