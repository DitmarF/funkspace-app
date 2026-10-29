import { homeIntroBootstrapScript } from "@/infrastructure/motion/HomeIntroBinding";

/** Startup composition boundary, analogous to the isolated theme script. */
export function HomeIntroScript({ available }: { available: boolean }) {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: homeIntroBootstrapScript(available) }}
    />
  );
}
