import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import CarouselSection from '../components/landing/Carousel';
import TeacherSection from '../components/landing/TeacherSection';
import SkillsSection from '../components/landing/SkillsSection';
import ReviewSection from '../components/landing/ReviewSection';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Nav />
      <main className="flex-grow pt-28 w-full bg-white">
        <HeroSection />
        <CarouselSection />
        <TeacherSection />
        <SkillsSection />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  );
}
