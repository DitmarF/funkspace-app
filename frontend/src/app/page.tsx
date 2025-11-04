import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-fs-action-primary">FunkSpace</h1>
      <ThemeSwitcher />
    </main>
  );
}
