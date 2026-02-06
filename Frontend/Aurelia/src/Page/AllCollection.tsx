import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import ArchivesSection from "../Components/Collection/ArchiveService";
import SeasonGrid from "../Components/Collection/SeasonGrid";
import Hero from "../Components/Collection/Hero";

export const AllCollection = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-[1440px] mx-auto px-6 lg:px-12 w-full pb-24">
        <Hero />
        <SeasonGrid />
        <ArchivesSection />
      </main>
      <Footer />
    </div>
  );
};
