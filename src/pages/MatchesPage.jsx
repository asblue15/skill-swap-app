import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Spinner from '../components/shared/Spinner';
import { getUsersExcept } from '../services/mockDataService';
import UserCard from '../components/shared/UserCard';
import Toast from '../components/shared/Toast';

export default function MatchesPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState({
    perfectMatches: [],
    goodMatches: [],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({
    name: '',
    message: '',
    avatar: '',
  });
  // States for tooltips
  const [showPerfectTooltip, setShowPerfectTooltip] = useState(false);
  const [showGoodTooltip, setShowGoodTooltip] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Get all users except current user
        const otherUsers = await getUsersExcept();

        // Process matches
        const matchResults = findMatches(user, otherUsers);

        const { perfectMatches, goodMatches } = matchResults;
        setMatches({ perfectMatches, goodMatches });

        // check if toast already shown
        const hasSeenToast = localStorage.getItem('hasSeenMatchToast');

        // Show toast notification if there are matches and hasn't been shown before
        if (!hasSeenToast && perfectMatches.length > 0) {
          const perfectMatch = perfectMatches[0];
          setToastData({
            name: perfectMatch.name,
            message: `Perfect match found! You both can teach each other skills.`,
            avatar: perfectMatch.profilePicture || '/images/profiles/default-avt.png',
          });
          setShowToast(true);
          localStorage.setItem('hasSeenMatchToast', 'true');
        } else if (!hasSeenToast && goodMatches.length > 0) {
          const goodMatch = goodMatches[0];
          setToastData({
            name: goodMatch.name,
            message: `Good match found! You can exchange skills.`,
            avatar: goodMatch.profilePicture || '/images/profiles/default-avt.png',
          });
          setShowToast(true);
          localStorage.setItem('hasSeenMatchToast', 'true');
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        setToastData({
          name: 'Error',
          message: "Couldn't load your matches. Please try again.",
          avatar: '/images/profiles/default-avt.png',
        });
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMatches();
    }
  }, [user]);

  // Find matches between current user and other users
  const findMatches = (currentUser, otherUsers) => {
    const perfectMatches = [];
    const goodMatches = [];
    const basicMatches = [];

    if (!currentUser || !currentUser.canTeach || !currentUser.wantsToLearn) {
      return { perfectMatches, goodMatches, basicMatches };
    }

    // Process each potential match
    otherUsers.forEach((otherUser) => {
      if (!otherUser.canTeach || !otherUser.wantsToLearn) return;

      // Check what current user can teach that other user wants to learn
      const userCanTeachOther = currentUser.canTeach.filter((teachSkill) =>
        otherUser.wantsToLearn.some(
          (learnSkill) =>
            teachSkill.skill.toLowerCase() === learnSkill.skill.toLowerCase() &&
            teachSkill.category === learnSkill.category &&
            isLevelCompatible(teachSkill.level, learnSkill.level)
        )
      );

      // Check what other user can teach that current user wants to learn
      const otherCanTeachUser = otherUser.canTeach.filter((teachSkill) =>
        currentUser.wantsToLearn.some(
          (learnSkill) =>
            teachSkill.skill.toLowerCase() === learnSkill.skill.toLowerCase() &&
            teachSkill.category === learnSkill.category &&
            isLevelCompatible(teachSkill.level, learnSkill.level)
        )
      );

      // Create match object with compatibility details
      const matchObject = {
        ...otherUser,
        canTeachUser: otherCanTeachUser,
        canLearnFromUser: userCanTeachOther,
        matchType:
          userCanTeachOther.length > 0 && otherCanTeachUser.length > 0
            ? 'perfect'
            : userCanTeachOther.length > 0 || otherCanTeachUser.length > 0
              ? 'good'
              : 'basic',
      };

      // Sort into appropriate match category
      if (userCanTeachOther.length > 0 && otherCanTeachUser.length > 0) {
        perfectMatches.push(matchObject);
      } else if (userCanTeachOther.length > 0 || otherCanTeachUser.length > 0) {
        goodMatches.push(matchObject);
      } else {
        basicMatches.push(matchObject);
      }
    });

    return { perfectMatches, goodMatches, basicMatches };
  };

  // check if teaching level is compatible with learning level
  const isLevelCompatible = (teachLevel, learnLevel) => {
    const levels = { beginner: 1, intermediate: 2, expert: 3 };
    const teachValue = levels[teachLevel.toLowerCase()];
    const learnValue = levels[learnLevel.toLowerCase()];

    // Teacher should be at same level or higher than learner
    return teachValue >= learnValue;
  };

  // simple tooltip, if time allowed, we'll make a shared component for it.
  const Tooltip = ({ show, children }) => {
    if (!show) return null;

    return (
      <div className="absolute z-10 w-64 p-3 mt-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg">
        {children}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner fullWidth />
      </div>
    );
  }

  const hasRelevantMatches = matches.perfectMatches.length > 0 || matches.goodMatches.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <Toast
            name={toastData.name}
            message={toastData.message}
            avatar={toastData.avatar}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Your potential match</h1>
          <p className="mt-2 text-lg text-gray-600">Hope you could find your perfect match soon.</p>
        </div>

        {!hasRelevantMatches ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">No matches found yet</h2>
            <p className="mt-2 text-gray-500">Browse all users to find your perfect match</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center px-4 py-2 border border-pink-800 text-sm font-medium rounded-md shadow-sm bg-transparent hover:bg-pink-50"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Perfect Matches */}
            {matches.perfectMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 relative">
                  <h2 className="text-2xl font-bold text-gray-900">Perfect Matches</h2>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowPerfectTooltip(true)}
                    onMouseLeave={() => setShowPerfectTooltip(false)}
                  >
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full cursor-help">
                      Two-Way Match
                    </span>
                    <Tooltip show={showPerfectTooltip}>
                      <p>
                        Perfect! You can teach them skills they want to learn; they can teach you
                        skills you want to learn.
                      </p>
                    </Tooltip>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {matches.perfectMatches.map((match) => (
                    <div
                      key={match.id}
                      className="border-t-4 border-green-500 rounded-lg overflow-hidden"
                    >
                      <UserCard user={match} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Good Matches */}
            {matches.goodMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 relative">
                  <h2 className="text-2xl font-bold text-gray-900">Good Matches</h2>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowGoodTooltip(true)}
                    onMouseLeave={() => setShowGoodTooltip(false)}
                  >
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full cursor-help">
                      One-Way Match
                    </span>
                    <Tooltip show={showGoodTooltip}>
                      <p>
                        Either you can teach them skills they want to learn, or they can teach you
                        skills you want to learn, but not both.
                      </p>
                    </Tooltip>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {matches.goodMatches.map((match) => (
                    <div
                      key={match.id}
                      className="border-t-4 border-blue-500 rounded-lg overflow-hidden"
                    >
                      <UserCard user={match} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Back to all users */}
            <section className="mt-12 text-center py-10 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Not happy with your matches?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Browse our entire community to find the perfect match.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-5 py-3 border border-pink-800 text-base font-medium rounded-md shadow-sm text-white bg-transparent hover:bg-pink-50"
              >
                Find Your Own Match
              </Link>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
