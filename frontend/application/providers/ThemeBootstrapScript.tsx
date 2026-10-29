import { themeBootstrapScript } from "../../generated/theme-bootstrap";

/** Startup composition boundary: imports trusted script data, never browser effects. */
export function ThemeBootstrapScript() {
  return (
    <script
      id="theme-script"
      dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
    />
  );
}
