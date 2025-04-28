import { Link } from "react-router-dom"
import community from "../../assets/community.png"

export default function HeroSection() {
  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row">
        {/* Left Side - Pink Section with Text */}
        <div className="w-full md:w-1/2 bg-[#f9a8d4] py-24 md:py-32 lg:py-40 px-8 md:px-16 flex flex-col justify-center">
          <div className="w-full text-left">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "var(--secondary-font)" }}
            >
              DREAM IT. BUILD IT. MONETIZE IT.
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-xl">
              Join a global community of learners and master your craft with high-quality, hands-on classes that bring
              your ideas to life with SkillSwapLite
            </p>
            <div>
              <Link
                to="/signup"
                className="inline-flex items-center bg-black text-white px-10 py-4 text-xl rounded-md hover:bg-gray-800 transition-colors"
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Yellow Section with Image */}
        <div className="w-full md:w-1/2 bg-[#fbbf24] py-24 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden">
          <div className="transform scale-110 md:scale-125">
            <img
              src={community}
              alt="People connected in a learning community"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}