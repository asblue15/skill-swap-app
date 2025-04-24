import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Spinner from '../components/shared/Spinner';
import { getCategories, updateUser } from '../services/mockDataService';

export default function OnboardingPage() {
  const { user, updateUserData } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const nav = useNavigate();

  // bio and profile-----------------------------------------------------------------------
  const MAX_BIO_LENGTH = 150;
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || '/images/profiles/default-avt.png'
  );

  // links---------------------------------------------------------------------------------
  const [socialLinks, setSocialLinks] = useState({
    link1: user?.link1 || '',
    link2: user?.link2 || '',
    link3: user?.link3 || '',
  });

  // profile pic---------------------------------------------------------------------------
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  // teaching state------------------------------------------------------------------------
  const [teachSkillForm, setTeachSkillForm] = useState({
    category: '',
    skill: '',
    customSkill: '',
    level: 'Intermediate',
  });
  const [skillsToTeach, setSkillsToTeach] = useState(user?.canTeach || []);
  const [categorySkills, setCategorySkills] = useState({});
  // show skill after choosing a category
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = getCategories();
        setCategories(categoriesData);
        const skillsByCategory = {};
        categoriesData.forEach((cat) => {
          skillsByCategory[cat.name] = cat.skills;
        });
        setCategorySkills(skillsByCategory);
      } catch (error) {
        console.error('Cannot fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTeachFormChange = (field, value) => {
    setTeachSkillForm((prev) => {
      if (field === 'category') {
        return { ...prev, [field]: value, skill: '', customSkill: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleAddTeachSkill = () => {
    const { category, skill, customSkill, level } = teachSkillForm;
    const skillName = skill === 'Other' ? customSkill : skill;

    if (skillName && skillName.length <= 30 && category) {
      const newSkill = {
        skill: skillName,
        category,
        level,
      };

      setSkillsToTeach((prev) => [...prev, newSkill]);
      setTeachSkillForm({
        category: '',
        skill: '',
        customSkill: '',
        level: 'Intermediate',
      });
    }
  };

  const handleRemoveTeachSkill = (indexToRemove) => {
    setSkillsToTeach((prevSkills) => prevSkills.filter((_, index) => index !== indexToRemove));
  };

  // learning state-------------------------------------------------------------------------
  const [learnSkillForm, setLearnSkillForm] = useState({
    category: '',
    skill: '',
    customSkill: '',
    level: 'Beginner',
  });
  const [skillsToLearn, setSkillsToLearn] = useState(user?.wantsToLearn || []);
  const [learnCategorySkills, setLearnCategorySkills] = useState({});

  // show skill after choosing a category
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesData = getCategories();
        setCategories(categoriesData);
        const skillsByCategory = {};
        categoriesData.forEach((cat) => {
          skillsByCategory[cat.name] = cat.skills;
        });
        setLearnCategorySkills(skillsByCategory);
      } catch (error) {
        console.error('Cannot fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLearnFormChange = (field, value) => {
    setLearnSkillForm((prev) => {
      if (field === 'category') {
        return { ...prev, [field]: value, skill: '', customSkill: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleAddLearnSkill = () => {
    const { category, skill, customSkill, level } = learnSkillForm;
    const skillName = skill === 'Other' ? customSkill : skill;

    if (skillName && skillName.length <= 30 && category) {
      const newSkill = {
        skill: skillName,
        category,
        level,
      };
      setSkillsToLearn((prev) => [...prev, newSkill]);
      setLearnSkillForm({
        category: '',
        skill: '',
        customSkill: '',
        level: 'Beginner',
      });
    }
  };

  const handleRemoveLearnSkill = (indexToRemove) => {
    setSkillsToLearn((prevSkills) => prevSkills.filter((_, index) => index !== indexToRemove));
  };
  // submit---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedUserData = {
        ...user,
        bio,
        profilePicture,
        link1: socialLinks.link1,
        link2: socialLinks.link2,
        link3: socialLinks.link3,
        canTeach: skillsToTeach,
        wantsToLearn: skillsToLearn,
      };

      await updateUser(updatedUserData);
      updateUserData(updatedUserData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); //simulate loading
      nav('/matches');
    } catch (error) {
      console.error('Cannot onboard:', error);
      alert('Cannot onboard now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner fullWidth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-[60%_40%] gap-0">
            {/* left */}
            <div className="p-6 border-r border-gray-200">
              {/* teach */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold">Can Teach</h3>

                {skillsToTeach.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{skill.skill}</p>
                      <p className="text-sm text-gray-500">
                        {skill.category} — Level: {skill.level}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-sm"
                      onClick={() => handleRemoveTeachSkill(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                {/* TEACH CATEGORY */}
                <div className="flex flex-col md:flex-row gap-3 md:items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={teachSkillForm.category}
                      onChange={(e) => handleTeachFormChange('category', e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Pick one</option>
                      {Array.isArray(categories) &&
                        categories.map((category, idx) => (
                          <option
                            key={idx}
                            value={typeof category === 'string' ? category : category.name}
                          >
                            {typeof category === 'string' ? category : category.name}
                          </option>
                        ))}
                      {/* <option value="Other">Other</option> */}
                    </select>
                  </div>

                  {teachSkillForm.category && (
                    <div>
                      <label className="block mb-1">Skill</label>
                      <select
                        value={teachSkillForm.skill}
                        onChange={(e) => handleTeachFormChange('skill', e.target.value)}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Pick one</option>
                        {teachSkillForm.category &&
                          categorySkills[teachSkillForm.category]?.map((skill, index) => (
                            <option key={index} value={skill}>
                              {skill}
                            </option>
                          ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                  {teachSkillForm.skill === 'Other' && (
                    <div>
                      <label className="block mb-1">Custom skill</label>
                      <input
                        type="text"
                        value={teachSkillForm.customSkill}
                        onChange={(e) => handleTeachFormChange('customSkill', e.target.value)}
                        className="w-full border p-2 rounded"
                        maxLength={30}
                        placeholder="Name your skill"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <select
                      value={teachSkillForm.level}
                      onChange={(e) => handleTeachFormChange('level', e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleAddTeachSkill}
                      disabled={
                        !teachSkillForm.category ||
                        !(
                          teachSkillForm.skill &&
                          (teachSkillForm.skill !== 'Other' || teachSkillForm.customSkill)
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* learn */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold">Want To Learn</h3>

                {skillsToLearn.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{skill.skill}</p>
                      <p className="text-sm text-gray-500">
                        {skill.category} — Level: {skill.level}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-sm"
                      onClick={() => handleRemoveLearnSkill(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                {/* LEARN CATEGORY */}
                <div className="flex flex-col md:flex-row gap-3 md:items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={learnSkillForm.category}
                      onChange={(e) => handleLearnFormChange('category', e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Pick one</option>
                      {Array.isArray(categories) &&
                        categories.map((category, idx) => (
                          <option
                            key={idx}
                            value={typeof category === 'string' ? category : category.name}
                          >
                            {typeof category === 'string' ? category : category.name}
                          </option>
                        ))}
                      {/* <option value="Other">Other</option> */}
                    </select>
                  </div>

                  {learnSkillForm.category && (
                    <div>
                      <label className="block mb-1">Skill</label>
                      <select
                        value={learnSkillForm.skill}
                        onChange={(e) => handleLearnFormChange('skill', e.target.value)}
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Pick one</option>
                        {learnSkillForm.category &&
                          learnCategorySkills[learnSkillForm.category]?.map((skill, index) => (
                            <option key={index} value={skill}>
                              {skill}
                            </option>
                          ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                  {learnSkillForm.skill === 'Other' && (
                    <div>
                      <label className="block mb-1">Custom skill</label>
                      <input
                        type="text"
                        value={learnSkillForm.customSkill}
                        onChange={(e) => handleLearnFormChange('customSkill', e.target.value)}
                        className="w-full border p-2 rounded"
                        maxLength={30}
                        placeholder="Name your skill"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <select
                      value={learnSkillForm.level}
                      onChange={(e) => handleLearnFormChange('level', e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleAddLearnSkill}
                      disabled={
                        !learnSkillForm.category ||
                        !(
                          learnSkillForm.skill &&
                          (learnSkillForm.skill !== 'Other' || learnSkillForm.customSkill)
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="my-8">
                <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <input
                      key={num}
                      type="text"
                      value={socialLinks[`link${num}`]}
                      onChange={(e) =>
                        setSocialLinks({ ...socialLinks, [`link${num}`]: e.target.value })
                      }
                      placeholder={`Social Link ${num}`}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* right */}

            <div className="p-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-100"
                  />
                  <label className="absolute bottom-0 right-0 bg-pink-900 rounded-full p-2 cursor-pointer hover:bg-pink-600 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
                <h2 className="text-2xl font-semibold">{user?.name || 'Your Name'}</h2>
                <p className="text-gray-500">{user?.email || 'your.email@example.com'}</p>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">About me</h3>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={MAX_BIO_LENGTH}
                  rows={5}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Tell others a bit about yourself..."
                />
                <p className="text-sm text-gray-500 text-right">
                  {bio.length}/{MAX_BIO_LENGTH}
                </p>
              </div>

              {/* links */}

              {/* connections */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Connections</h3>
                {user?.connections?.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {user.connections.map((connection) => (
                      <div key={connection.id} className="text-center">
                        <img
                          src={connection.profilePicture}
                          alt={connection.name}
                          className="w-12 h-12 rounded-full mx-auto"
                        />
                        <p className="text-xs mt-1">{connection.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No connections yet.</p>
                )}
              </div>

              {/* Submit */}
              <div className="text-right py-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" />
                    </>
                  ) : (
                    <span>Finish Onboarding</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
