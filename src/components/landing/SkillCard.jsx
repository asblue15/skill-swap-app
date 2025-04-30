import React from 'react';

const SkillCard = ({ icon, title, description, tags, bgColor }) => {
  return (
    <div className={`rounded-lg border border-black p-6 ${bgColor}`}>
      <div className="mb-2">{icon}</div>
      <h2 className="text-3xl mb-2">{title}</h2>
      <p className="text-md mb-4">{description}</p>
      <p className="text-xs font-semibold mb-2">Popular tags</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="bg-white border border-black text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillCard;
