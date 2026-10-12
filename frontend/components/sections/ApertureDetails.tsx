import PortfolioSection from "../Layouts/PortfolioSection";
import Start from "./Start";
import styles from "./ApertureDetails.module.css";

/** Shared details composition for the route and Storybook; the scene stays in Start. */
export default function ApertureDetails() {
  return (
    <article className={styles.sections} aria-labelledby="start-heading">
      <Start customizable />
      <PortfolioSection
        aria-labelledby="aperture-guide"
        className={`${styles.guide} text-portfolio-body`}
      >
        <h2 id="aperture-guide" className="text-3xl">
          How it works
        </h2>
        <p>
          Moving dots connect to nearby dots, making a web that keeps changing.
          The WEB letters act like a window onto this moving field.
        </p>
        <h3 className="text-2xl">Canvas + SVG: motion and shape</h3>
        <p>
          Canvas is the drawing surface. It redraws the particles (small dots)
          and their connecting lines as they move. Nearby dots can link up;
          those lines change as the dots drift apart or meet new neighbours.
        </p>
        <p>
          An SVG mask makes the WEB-shaped opening in a cover above the Canvas.
          SVG describes shapes that stay crisp at different sizes. The cover
          hides the field outside the letters, while the same dots and lines
          continue moving underneath. Full field hides the cover so you can see
          how the whole pattern works.
        </p>
        <h3 className="text-2xl">Make it your own</h3>
        <p>
          Open Customize to adjust the picture. It stays still while the dialog
          is open. Close it to see the result in motion, if motion is enabled
          and the scene isn’t paused.
        </p>
        <dl className={styles.glossary}>
          <div>
            <dt>Particles</dt>
            <dd>How many dots fill the scene. More dots can make it busier.</dd>
          </div>
          <div>
            <dt>Speed</dt>
            <dd>How fast the dots move.</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>
              How large the dots appear. The hint shows their smallest and
              largest widths at the current setting.
            </dd>
          </div>
          <div>
            <dt>Links</dt>
            <dd>
              The most lines each dot can have. Nearby dots may have fewer.
              Close pairs get priority.
            </dd>
          </div>
          <div>
            <dt>Reach</dt>
            <dd>How far dots can connect. More reach can make a denser web.</dd>
          </div>
          <div>
            <dt>Full field</dt>
            <dd>
              Show the whole field instead of the WEB cutout, when the scene is
              ready.
            </dd>
          </div>
        </dl>
        <p>
          Values marked × are multipliers: higher means faster, larger or
          farther. Dense settings may use fewer or shorter links to keep the
          page responsive.
        </p>
        <p>
          Try changing one setting at a time: lower Particles for a quieter
          picture, then raise Reach to connect more of the remaining dots. Speed
          changes the movement, rather than the shape of the WEB letters.
        </p>
        <h3 className="text-2xl">Pause, reset and return</h3>
        <p>
          Pause stops this scene. Your motion setting in the menu still applies:
          Off and Reduced keep it still; System follows your device. On allows
          motion, even if your device requests less.
        </p>
        <p>
          The scene also rests when it is offscreen or covered by a menu. If
          animation cannot load, solid WEB artwork keeps the page readable.
        </p>
        <p>
          Closing Customize keeps your changes while you stay on this page.
          Reloading restores defaults. Reset restores the starting pattern,
          settings and WEB cutout without changing Pause, your theme or motion
          setting.
        </p>
      </PortfolioSection>
    </article>
  );
}
