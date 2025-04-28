import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import CarouselSection from '../components/landing/Carousel';

export default function LandingPage() {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <Nav />
        <main className="flex-grow pt-32 pb-8 w-full">
          <HeroSection />
          <CarouselSection />
        </main>
        <Footer />
      </div>
    )
  }
