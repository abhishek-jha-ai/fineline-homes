import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedPlans } from "@/components/FeaturedPlans";
import { RegionSelector } from "@/components/RegionSelector";
import { ProjectGallery } from "@/components/ProjectGallery";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { ConsultationSection } from "@/components/ConsultationSection";
import { Footer } from "@/components/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { PlanDialog } from "@/components/PlanDialog";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <FeaturedPlans />
        <RegionSelector />
        <ProjectGallery />
        <About />
        <Process />
        <ConsultationSection />
      </main>
      <Footer />
      <PlanDialog />
      <MobileStickyCTA />
    </>
  );
}
