import Nav from '../components/layout/Nav';
import HeroSection from '../components/landing/HeroSection';
import CarouselSection from '../components/landing/Carousel';
import TeacherSection from '../components/landing/TeacherSection';
import SkillsSection from '../components/landing/SkillsSection';
import ReviewSection from '../components/landing/ReviewSection';
import StorySection from '../components/landing/StorySection';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <main className="flex-grow w-full bg-white">
      <Nav />
      <HeroSection />
      <CarouselSection />
      <StorySection />
      <TeacherSection />
      <SkillsSection />
      <ReviewSection />
      <Footer />
    </main>
  );
}
