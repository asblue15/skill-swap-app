import React from 'react';
import TeacherIllustration from '../../assets/teacher-section.png';

const TeacherSection = () => {
  return (
    <section className="bg-white text-center py-16 border-t-2 border-t-black">
      <div className="mx-auto">
        <p className="text-6xl mb-4 text-black">A teacher was once a student</p>
        <p className="text-gray-600 text-lg mb-24">
          They were beginners too.
          <br />
          They struggled, learned, and kept going — just like you.
        </p>

        <div className="mb-20">
          <img
            src={TeacherIllustration}
            alt="Teacher Illustration"
            className="w-fit h-auto mx-auto"
          />
        </div>

        <div className="bg-[#FF90E8] py-20 border-y-2 border-y-black">
          <h2 className="text-6xl md:text-5xl font-medium mb-10 text-black">
            Share what you know. <br />
            Someone out there needs it.
          </h2>
          <a
            href="/signup"
            className="inline-flex items-center bg-black px-14 py-4 rounded-md font-medium hover:bg-gray-800 transition duration-300"
          >
            <span className="text-white">Start exploring</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeacherSection;
