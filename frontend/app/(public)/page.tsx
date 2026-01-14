import Hero from "@/components/home/Hero";
import SearchSection from "@/components/home/SearchSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Services from "@/components/home/Services";
// import WhyChooseUs from "@/components/home/WhyChooseUs";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <SearchSection />
      <FeaturedProperties />
      <Services />
      {/* <WhyChooseUs /> */}
      <CallToAction />
    </>
  );
}
