import Hero from "@/components/Hero";
import SectionTwo from "@/components/SectionTwo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <Hero />
      <SectionTwo />
      <Footer />
    </main>
  );
}
