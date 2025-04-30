import React from 'react';
import SkillCard from './SkillCard';
import PaintIcon from '../../assets/paint.svg';
import BusinessIcon from '../../assets/business.svg';
import CameraIcon from '../../assets/camera.svg';
import ClickIcon from '../../assets/click.svg';
import ExerciseIcon from '../../assets/exercise.svg';
import WriteIcon from '../../assets/write.svg';

const skills = [
  {
    icon: <img src={PaintIcon} alt="Design Icon" className="w-24 h-24" />,
    title: 'Design',
    description: 'Code, design and ship your product with these technical resources',
    tags: ['mockup', 'font', 'textures'],
    bgColor: 'bg-yellow-400',
  },
  {
    icon: <img src={WriteIcon} alt="Design Icon" className="w-24 h-24" />,
    title: 'Writing & Publishing',
    description: 'Fill your brain with words and wisdom from creative authors and storytellers.',
    tags: ['ebook', 'low content book'],
    bgColor: 'bg-red-500',
  },
  {
    icon: <img src={ClickIcon} alt="Design Icon" className="w-24 h-24" />,
    title: 'Software Development',
    description: 'Learn to code and tools to help you code more productively.',
    tags: ['windows', 'theme', 'programming'],
    bgColor: 'bg-yellow-300',
  },
  {
    icon: <img src={CameraIcon} alt="Design Icon" className="w-24 h-24" />,
    title: 'Photography',
    description: 'Get snapping with pro presets, stock imagery, and digi darkroom needs.',
    tags: ['reference photos', 'stock photos', 'photobash'],
    bgColor: 'bg-teal-600',
  },
  {
    icon: <img src={ExerciseIcon} alt="Design Icon" className="w-24 h-24" />,
    title: 'Fitness & Health',
    description: "Whether you're looking to shed or shred, here are coaches to pump you up.",
    tags: ['fitness', 'yoga', 'workout program'],
    bgColor: 'bg-yellow-200',
  },
  {
    icon: <img src={BusinessIcon} alt="Design Icon" className="w-24 h-24" />,
    title: 'Business & Money',
    description: 'Learn to earn in an increasingly unpredictable world.',
    tags: ['instagram', 'investing', 'notion template'],
    bgColor: 'bg-indigo-300',
  },
];

const SkillsSection = () => {
  return (
    <section className="py-16 px-4 bg-white text-center">
      <h2 className="text-6xl md:text-6xl mb-4 text-black">Looking for a skill to start with?</h2>
      <p className="text-gray-600 text-lg mb-24 max-w-2xl mx-auto">
        Discover the most shared skills and inspiring teachers on SkillSwapLite
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto px-14 text-black text-left">
        {skills.map((skill, index) => (
          <SkillCard key={index} {...skill} />
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
