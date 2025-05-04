import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { getCategories, getUserConnections } from '../../services/mockDataService';
import UserConnection from './UserConnection';
import { useConnectionContext } from '../../contexts/ConnectionContext';
import { useUser } from '../../contexts/UserContext';

// Helper function to check skill level compatibility
const isSkillLevelCompatible = (teachLevel, learnLevel) => {
  const levelRank = {
    Beginner: 1,
    Intermediate: 2,
    Expert: 3,
  };

  // if teach level is higher than learn level, it's not logical
  // allow SAME levels (can teach Intermediate, but also want to learn more Intermediate)
  return levelRank[teachLevel] <= levelRank[learnLevel];
};

// check if a skill already exists in the other list with wrong level
const checkSkillCompatibility = (newSkill, otherSkillsList) => {
  const matchingSkill = otherSkillsList.find(
    (s) => s.skill.trim().toLowerCase() === newSkill.skill.trim().toLowerCase()
  );

  if (!matchingSkill) return { compatible: true };

  // check if the teach level is lower than or equal to learn level
  if (newSkill.isTeaching) {
    return {
      compatible: isSkillLevelCompatible(newSkill.level, matchingSkill.level),
      message: `Level too high`,
    };
  } else {
    // check if the learn level is higher than or equal to teach level
    return {
      compatible: isSkillLevelCompatible(matchingSkill.level, newSkill.level),
      message: `Level too low`,
    };
  }
};

// refactor: extract SkillForm for reuse
const SkillForm = ({
  skillType, // teach || learn
  skillForm,
  handleFormChange,
  handleAddSkill,
  skills,
  isSkillDup,
  categorySkills,
  errorMessage,
}) => {
  const fieldLabel = skillType === 'teach' ? 'Level I can teach' : 'My current Level';
  const defaultLevel = skillType === 'teach' ? 'Intermediate' : 'Beginner';

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Skill</h4>
      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={skillForm.category}
            onChange={(e) => handleFormChange('category', e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Pick one</option>
            {Object.keys(categorySkills).map((category, idx) => (
              <option key={idx} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {skillForm.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Skill</label>
            <select
              value={skillForm.skill}
              onChange={(e) => handleFormChange('skill', e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Pick one</option>
              {skillForm.category &&
                categorySkills[skillForm.category]?.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        {skillForm.skill === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Custom skill</label>
            <input
              type="text"
              value={skillForm.customSkill}
              onChange={(e) => handleFormChange('customSkill', e.target.value)}
              className="w-full border p-2 rounded"
              maxLength={30}
              placeholder="Name your skill"
            />
          </div>
        )}

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">{fieldLabel}</label>
          <select
            value={skillForm.level}
            onChange={(e) => handleFormChange('level', e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div>
          {isSkillDup && <p className="text-red-500 text-sm">skill existed</p>}
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={
              !skillForm.category ||
              !(skillForm.skill && (skillForm.skill !== 'Other' || skillForm.customSkill)) ||
              skills.length >= 4 ||
              isSkillDup ||
              errorMessage
            }
            className="custom-button px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// refactor: extract SkillList for reuse
const SkillsList = ({ skillType, skills, isEditing, handleRemoveSkill }) => {
  const title = skillType === 'teach' ? 'Teaching' : 'Learning';

  return (
    <div className="space-y-4 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isEditing && <span className="text-sm text-gray-500">{skills.length}/4 skills</span>}
      </div>

      {skills.map((skill, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm"
        >
          <div>
            <p className="font-medium">{skill.skill}</p>
            <p className="text-sm text-gray-500">
              {skill.category} — {skill.level}
            </p>
          </div>
          {isEditing && (
            <button
              type="button"
              className="custom-button px-4 py-2 bg-red-700 text-white rounded"
              onClick={() => handleRemoveSkill(index)}
            >
              -
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default function UserForm({
  userData,
  onSubmit,
  isEditing = true,
  submitButtonText = 'Save Changes',
  showConnections = false,
  navigateToMatches = null,
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user: authUser } = useUser();
  const fullConnections = getUserConnections(userData?.id);
  const isCurrentUser = authUser?.id === userData?.id;
  const { updateUserInList } = useConnectionContext();

  // bio and profile-----------------------------------------------------------------------
  const MAX_BIO_LENGTH = 100;
  const [bio, setBio] = useState(userData?.bio || '');
  const [profilePicture, setProfilePicture] = useState(
    userData?.profilePicture || '/images/profiles/default-avt.png'
  );

  // links---------------------------------------------------------------------------------
  const [socialLinks, setSocialLinks] = useState({
    link1: userData?.link1 || '',
    link2: userData?.link2 || '',
    link3: userData?.link3 || '',
  });

  // ref: format links to show only domain names for display
  const formatLink = (url) => {
    if (!url) return null;
    try {
      // Extract domain name from URL
      const domain = new URL(url).hostname.replace('www.', '');
      return { url, domain };
    } catch {
      return { url, domain: url };
    }
  };

  // links array for display
  const displayLinks = [userData?.link1, userData?.link2, userData?.link3]
    .filter(Boolean)
    .map(formatLink);

  // profile pic---------------------------------------------------------------------------
  // ref https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // refactor: Unified skills state management-------------------------------------------------------
  const [categorySkills, setCategorySkills] = useState({});

  // teaching state------------------------------------------------------------------------
  const [teachSkillForm, setTeachSkillForm] = useState({
    category: '',
    skill: '',
    customSkill: '',
    level: 'Intermediate',
  });
  const [skillsToTeach, setSkillsToTeach] = useState(userData?.canTeach || []);
  const [isTeachSkillDup, setIsTeachSkillDup] = useState(false);
  const [teachSkillError, setTeachSkillError] = useState('');

  // learning state-------------------------------------------------------------------------
  const [learnSkillForm, setLearnSkillForm] = useState({
    category: '',
    skill: '',
    customSkill: '',
    level: 'Beginner',
  });
  const [skillsToLearn, setSkillsToLearn] = useState(userData?.wantsToLearn || []);
  const [isLearnSkillDup, setIsLearnSkillDup] = useState(false);
  const [learnSkillError, setLearnSkillError] = useState('');

  // fetch categories and skills------------------------------------------------------------
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

  // Update form values when userData changes------------------------------------------------
  useEffect(() => {
    if (userData) {
      setBio(userData.bio || '');
      setProfilePicture(userData.profilePicture || '/images/profiles/default-avt.png');
      setSocialLinks({
        link1: userData.link1 || '',
        link2: userData.link2 || '',
        link3: userData.link3 || '',
      });
      setSkillsToTeach(userData.canTeach || []);
      setSkillsToLearn(userData.wantsToLearn || []);
    }
  }, [userData]);

  // Generic form change handler-------------------------------------------------------------
  // solution for Tam's test case
  const createFormChangeHandler =
    (setFormState, setIsDupState, skillsArray, setErrorState, otherSkillsArray, isTeaching) =>
    (field, value) => {
      setFormState((prev) => {
        const newState =
          field === 'category'
            ? { ...prev, [field]: value, skill: '', customSkill: '' }
            : { ...prev, [field]: value };

        // Check for compatibility when changing skill or level
        if (field === 'skill' || field === 'level') {
          const skillName =
            field === 'skill' && value === 'Other'
              ? prev.customSkill
              : field === 'skill'
                ? value
                : prev.skill === 'Other'
                  ? prev.customSkill
                  : prev.skill;

          if (skillName) {
            // Create a temporary skill object to check compatibility
            const tempSkill = {
              skill: skillName,
              level: field === 'level' ? value : prev.level,
              isTeaching,
            };

            const { compatible, message } = checkSkillCompatibility(tempSkill, otherSkillsArray);

            if (!compatible) {
              setErrorState(message);
            } else {
              setErrorState('');
            }
          }
        }

        return newState;
      });

      // Check for duplicates - solution for Duong's test case
      if (field === 'skill' || field === 'customSkill') {
        const formState = setFormState === setTeachSkillForm ? teachSkillForm : learnSkillForm;
        const skillName = value === 'Other' ? formState.customSkill : value;

        if (skillName) {
          const isDuplicate = skillsArray.some(
            (s) => s.skill.trim().toLowerCase() === skillName.trim().toLowerCase()
          );
          setIsDupState(isDuplicate);
        }
      }
    };

  // Handle teach form changes---------------------------------------------------------------
  const handleTeachFormChange = createFormChangeHandler(
    setTeachSkillForm,
    setIsTeachSkillDup,
    skillsToTeach,
    setTeachSkillError,
    skillsToLearn,
    true
  );

  const handleAddTeachSkill = () => {
    const { category, skill, customSkill, level } = teachSkillForm;
    const skillName = skill === 'Other' ? customSkill : skill;

    if (skillName && skillName.length <= 30 && category) {
      // Check if skill already exists
      const dup = skillsToTeach.some(
        (s) => s.skill.trim().toLowerCase() === skillName.trim().toLowerCase()
      );

      if (dup) {
        setIsTeachSkillDup(true);
        return;
      }

      const newSkill = {
        skill: skillName,
        category,
        level,
      };

      // Check compatibility with learning skills
      const { compatible, message } = checkSkillCompatibility(
        { ...newSkill, isTeaching: true },
        skillsToLearn
      );

      if (!compatible) {
        setTeachSkillError(message);
        return;
      }

      setSkillsToTeach((prev) => [...prev, newSkill]);
      setTeachSkillForm({
        category: '',
        skill: '',
        customSkill: '',
        level: 'Intermediate',
      });
      setIsTeachSkillDup(false);
      setTeachSkillError('');
    }
  };

  const handleRemoveTeachSkill = (indexToRemove) => {
    const removedSkill = skillsToTeach[indexToRemove];
    setSkillsToTeach((prevSkills) => prevSkills.filter((_, index) => index !== indexToRemove));

    // Reset error messages in the learn form if they were related to this skill
    const matchingLearnSkill = skillsToLearn.find(
      (s) => s.skill.trim().toLowerCase() === removedSkill.skill.trim().toLowerCase()
    );

    if (matchingLearnSkill) {
      setLearnSkillError('');
    }

    // Also reset teach form error if currently showing one
    setTeachSkillError('');
  };

  // Handle learn form changes---------------------------------------------------------------
  const handleLearnFormChange = createFormChangeHandler(
    setLearnSkillForm,
    setIsLearnSkillDup,
    skillsToLearn,
    setLearnSkillError,
    skillsToTeach,
    false
  );

  const handleAddLearnSkill = () => {
    const { category, skill, customSkill, level } = learnSkillForm;
    const skillName = skill === 'Other' ? customSkill : skill;

    if (skillName && skillName.length <= 30 && category) {
      // Check if skill already exists
      const dup = skillsToLearn.some(
        (s) => s.skill.trim().toLowerCase() === skillName.trim().toLowerCase()
      );

      if (dup) {
        setIsLearnSkillDup(true);
        return;
      }

      const newSkill = {
        skill: skillName,
        category,
        level,
      };

      // Check compatibility with teaching skills
      const { compatible, message } = checkSkillCompatibility(
        { ...newSkill, isTeaching: false },
        skillsToTeach
      );

      if (!compatible) {
        setLearnSkillError(message);
        return;
      }

      setSkillsToLearn((prev) => [...prev, newSkill]);
      setLearnSkillForm({
        category: '',
        skill: '',
        customSkill: '',
        level: 'Beginner',
      });
      setIsLearnSkillDup(false);
      setLearnSkillError('');
    }
  };

  const handleRemoveLearnSkill = (indexToRemove) => {
    const removedSkill = skillsToLearn[indexToRemove];
    setSkillsToLearn((prevSkills) => prevSkills.filter((_, index) => index !== indexToRemove));

    // Reset error messages in the teach form if they were related to this skill
    const matchingTeachSkill = skillsToTeach.find(
      (s) => s.skill.trim().toLowerCase() === removedSkill.skill.trim().toLowerCase()
    );

    if (matchingTeachSkill) {
      setTeachSkillError('');
    }

    // Also reset learn form error if currently showing one
    setLearnSkillError('');
  };

  // Submit changes--------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedUserData = {
        ...userData,
        bio,
        profilePicture,
        link1: socialLinks.link1,
        link2: socialLinks.link2,
        link3: socialLinks.link3,
        canTeach: skillsToTeach,
        wantsToLearn: skillsToLearn,
      };

      await onSubmit(updatedUserData);
      updateUserInList(updatedUserData);
    } catch (error) {
      console.error('Cannot update user data:', error);
      alert('Cannot update data now. Please try again.');
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-[60%_40%] gap-0">
        {/* left */}
        <div className="p-4 border-r border-gray-200">
          {/* teaching skills section  */}
          <div className="bg-blue-50 p-4 rounded-lg mb-5">
            <SkillsList
              skillType="teach"
              skills={skillsToTeach}
              isEditing={isEditing}
              handleRemoveSkill={handleRemoveTeachSkill}
            />

            {/* add teach skill form - only shown in edit mode */}
            {isEditing && (
              <SkillForm
                skillType="teach"
                skillForm={teachSkillForm}
                handleFormChange={handleTeachFormChange}
                handleAddSkill={handleAddTeachSkill}
                skills={skillsToTeach}
                isSkillDup={isTeachSkillDup}
                categorySkills={categorySkills}
                errorMessage={teachSkillError}
              />
            )}
          </div>

          {/* learning skills section  */}
          <div className="bg-green-50 p-4 rounded-lg mb-5">
            <SkillsList
              skillType="learn"
              skills={skillsToLearn}
              isEditing={isEditing}
              handleRemoveSkill={handleRemoveLearnSkill}
            />

            {/* add learn skill form - only shown in edit mode */}
            {isEditing && (
              <SkillForm
                skillType="learn"
                skillForm={learnSkillForm}
                handleFormChange={handleLearnFormChange}
                handleAddSkill={handleAddLearnSkill}
                skills={skillsToLearn}
                isSkillDup={isLearnSkillDup}
                categorySkills={categorySkills}
                errorMessage={learnSkillError}
              />
            )}
          </div>

          {/* social links */}
          <div className="my-8">
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            {isEditing ? (
              <div className="space-y-3">
                {[1, 2, 3].map((num) => (
                  <input
                    key={num}
                    type="text"
                    value={socialLinks[`link${num}`]}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, [`link${num}`]: e.target.value })
                    }
                    placeholder={`Social Link ${num} (e.g., https://github.com/username)`}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {displayLinks.length > 0 ? (
                  displayLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {link.domain}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No social links added yet.</p>
                )}
              </div>
            )}
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
              {isEditing && (
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
              )}
            </div>
            <h2 className="text-2xl font-semibold">{userData?.name || 'Your Name'}</h2>
            <p className="text-gray-500">{userData?.email || 'your.email@example.com'}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">About me</h3>
            {isEditing ? (
              <div>
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
            ) : (
              <p className="text-gray-700">{bio || 'No bio added yet.'}</p>
            )}
          </div>

          {/* connections - only shown if showConnections is true */}
          {showConnections && (
            <UserConnection
              connections={fullConnections}
              isCurrentUser={isCurrentUser}
              navigateToMatches={navigateToMatches}
            />
          )}

          {/* submit button - edit mode */}
          {isEditing && (
            <div className="text-right py-8">
              <button type="submit" disabled={saving} className="">
                {saving ? (
                  <>
                    <Spinner size="sm" />
                  </>
                ) : (
                  <span>{submitButtonText}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
