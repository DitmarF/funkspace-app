"use client";

import { LogoMotion } from "@/components/Logo/LogoMotion";

/**
 * Test page for LogoMotion E2E tests
 * This page is used by Playwright to test the logo animation
 */
export default function LogoAnimationPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold text-fs-action-primary">
        Logo Animation Test
      </h1>
      <div className="border rounded-lg p-8 bg-white">
        <LogoMotion
          autoPlay={true}
          speed={1}
          pathCount={10}
          enabled={true}
          className="w-full max-w-2xl h-auto"
        />
      </div>
    </main>
  );
}
