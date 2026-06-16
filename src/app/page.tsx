import HeroSlider from "@/components/HeroSlider";
import HomeProjectVideos from "@/components/HomeProjectVideos";
import HeroServiceSections from "@/components/HeroServiceSections";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <HomeProjectVideos />
      <HeroServiceSections />
      <Contact />
    </>
  );
}
