import ParticleLifecycleFixture from "@/components/Scene/ParticleLifecycleFixture";

export const metadata = {
  title: "Aperture replacement fixture | FunkSpace",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ParticleLifecycleFixture aperture />;
}
