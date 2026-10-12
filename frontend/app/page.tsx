import Start from "@/components/sections/Start";
import AboutPreview from "@/components/sections/AboutPreview";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import styles from "./page.module.css";

export default function Home() {
  return (
    <PortfolioShell animateIdentity>
      <div className={styles.sections}>
        <Start />
        <AboutPreview />
      </div>
    </PortfolioShell>
  );
}
