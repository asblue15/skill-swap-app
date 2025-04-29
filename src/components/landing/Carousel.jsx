import { useEffect, useRef } from "react";
import animation from "../../assets/animation.png"
import film from "../../assets/film-video.png"
import art from "../../assets/fine-art.png"
import frelance from "../../assets/freelance.png"
import design from "../../assets/graphic-design.png"
import illustration from "../../assets/illustration.png"
import marketing from "../../assets/marketing.png"
import photography from "../../assets/photography.png"
import productivity from "../../assets/productivity.png"
import uiux from "../../assets/uiux.png"


export default function CarouselSection() {
  const carouselRef = useRef(null)

  useEffect(() => {
    const carousel = carouselRef.current
    let scrollInterval

    // Function to scroll the carousel
    const scrollCarousel = () => {
      if (carousel) {
        // If we've scrolled to the end, quickly reset to the beginning
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10) {
          carousel.scrollLeft = 0
        } else {
          // Otherwise, scroll by 1px
          carousel.scrollLeft += 1
        }
      }
    }

    // Start the auto-scroll
    scrollInterval = setInterval(scrollCarousel, 20)

    // Pause scrolling when user hovers over the carousel
    const handleMouseEnter = () => clearInterval(scrollInterval)
    const handleMouseLeave = () => {
      scrollInterval = setInterval(scrollCarousel, 20)
    }

    carousel.addEventListener("mouseenter", handleMouseEnter)
    carousel.addEventListener("mouseleave", handleMouseLeave)

    // Clean up
    return () => {
      clearInterval(scrollInterval)
      if (carousel) {
        carousel.removeEventListener("mouseenter", handleMouseEnter)
        carousel.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  // Categories data
  const categories = [
    {
      name: "Animation",
      image: animation,
    },
    {
      name: "Productivity",
      image: productivity
    },
    {
      name: "Film & Video",
      image: film,
    },
    {
      name: "Freeelance",
      image: frelance,
    },
    {
      name: "UI/UX Design",
      image: uiux,
    },
    {
      name: "Photography",
      image: photography,
    },
    {
      name: "Fine Art",
      image: art,
    },
    {
      name: "Marketing",
      image: marketing,
    },
    {
        name: "Graphic Design",
        image: design,
    },
    {
        name: "Illustration",
        image: illustration,
    },
   
  ]

  return (
    <section className="w-full py-20 bg-white border-t border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "var(--secondary-font)" }}>
          You can learn to become anyone
        </h2>
        <p className="text-xl md:text-2xl max-w-4xl mx-auto">
          We believe everyone has something to share — and something to learn. Teach what you know, learn what you want.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide py-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          {[...categories, ...categories].map((category, index) => (
            <div key={index} className="flex-none w-[300px] h-[350px] relative">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 p-6">
                <h3 className="text-white text-2xl font-bold drop-shadow-lg">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}