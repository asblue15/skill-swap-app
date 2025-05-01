import React from 'react';
import StephImage from '../../assets/review-person.png';
import Banner from '../../assets/banner.svg';

const ReviewSection = () => {
  return (
    <section className="bg-white pt-16 border-y-2 border-y-black text-black">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 lg:px-60 pt-10 pb-24">
        <div className="w-full md:w-1/2 mb-6 md:mb-0 text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-black max-w-md">
            THE TOP CHOICE FOR LEARNERS & MENTORS OF ALL LEVELS.
          </h2>
        </div>

        <div className="w-full md:w-1/2 text-left max-w-md">
          <p className="text-lg leading-relaxed mb-4 md:ml-auto">
            Learn directly from real people—sharpen your skills, share your knowledge, and grow
            together through real-world experience.
          </p>
          <a
            href="#"
            className="inline-flex items-center bg-black px-10 py-3 rounded-md font-medium hover:bg-gray-800 transition duration-300"
          >
            <span className="text-white">Read more story →</span>
          </a>
        </div>
      </div>

      <div className="bg-teal-600 px-6 py-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 text-left">
            <p className="text-2xl font-medium leading-relaxed">
              "I used to think I had nothing worth teaching. Then I shared a small skill on
              SkillSwapLite — and people actually found it helpful. Now I'm both learning new things
              and helping others grow. It’s simple, fun, and way more meaningful than I expected."
            </p>
            <p className="mt-4 font-semibold text-xl">– Steph Smith –</p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative flex justify-center items-center">
            <div className="w-[570px] h-[500px]">
              <img src={StephImage} alt="Steph Smith" className="w-[570px] h-[500px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12">
        <img src={Banner} alt="Banner" className="w-full h-auto" />
      </div>
    </section>
  );
};

export default ReviewSection;
