import Script from "next/script";
import { themeBootstrapScript } from "../../generated/theme-bootstrap";

/** Startup composition boundary: imports trusted script data, never browser effects. */
export function ThemeBootstrapScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
    />
  );
}
