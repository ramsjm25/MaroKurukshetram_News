import Header from "@/components/Header";
import BreakingNews from "@/components/BreakingNews";
import LocalMandi from "@/components/LocalMandi";
import PoliticsNews from "@/components/PoliticsNews";
import Categories from "@/components/Categories";
import BusinessNews from "@/components/BusinessNews";
import SportsSection from "@/components/SportsSection";
import JobsNews from "@/components/JobsNews";
import Footer from "@/components/Footer";
import Technology from "@/components/Technology";
import Entertainment from "@/components/Entertainment";
import Newspaper from "./Newspaper";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <BreakingNews />
        <PoliticsNews />
        <Newspaper />
        <Categories />
        <BusinessNews />
        <Technology />
        <Entertainment />
        <SportsSection />
        <JobsNews />
        <LocalMandi />
      </main>
      <Footer />
    </div>
  );
};

export default Index;