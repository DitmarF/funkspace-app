export default function TypographyPage() {
  const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="font-display text-5xl">Work Sans — Display</h1>
      <h2 className="mt-2 font-display text-3xl">Heading Level 2</h2>
      <p className="mt-4 font-sans text-base leading-7">
        Space Grotesk — body text paragraph for verification.
      </p>

      <section className="mt-8 grid grid-cols-2 gap-3">
        {weights.map((w) => (
          <div key={w} className="font-display" style={{ fontWeight: w }}>
            Work Sans weight {w}
          </div>
        ))}
      </section>
    </main>
  );
}
