import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import bgImage from '../assets/signup.webp';
import logo from '../assets/logo1.png';
import Spinner from '../components/shared/Spinner';
import { addUser } from '../services/mockDataService';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); //for demo only nhe, to show Spinner loading th

      const newUserId = `u${Date.now()}`; // or we could use uuid nha, but for now, we can keep it this way.
      const newUser = {
        id: newUserId,
        name,
        email,
        profilePicture: '/images/profiles/default-avt.png',
        bio: '',
        canTeach: [],
        wantsToLearn: [],
        connections: [],
        requestSent: [],
        requestReceived: [],
        notifications: [],
      };

      addUser(newUser);

      login(newUser);
      nav('/onboarding');
    } catch (err) {
      console.log('Signup error', err);
      alert('Failed to create account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Form  */}
      <div className="w-full md:w-1/2 lg:w-1/3 bg-white flex flex-col p-6 md:p-8 overflow-y-auto">
        {/* Logo */}
        <div className="mb-4">
          <Link to="/" className="flex items-center justify-center md:justify-start">
            <img src={logo} className="h-12 md:h-16" alt="Skillswap Logo" />
            <h1 className="font-semibold ml-2 text-lg md:text-xl">Skillswap</h1>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-grow flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
            <p className="text-xl md:text-2xl font-semibold text-gray-800">
              Join 1500+ teachers and learners who earn & learn with us.
            </p>

            {/* Google Sign Up Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition duration-200"
              onClick={() => alert('for demo only')}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <hr className="flex-grow border-gray-200" />
              <span className="text-gray-500 text-sm font-medium">or</span>
              <hr className="flex-grow border-gray-200" />
            </div>

            {/* Input */}
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white font-medium hover:bg-pink-700 transition duration-200"
              style={{ backgroundColor: 'var(--primary-color)' }}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>

            {/* Terms */}
            <p className="text-sm text-gray-500 text-left">
              You agree to our{' '}
              <a href="/terms" className="underline hover:text-gray-700">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </a>
              .
            </p>

            {/* Sign In Link */}
            <div className="text-sm text-gray-800 text-left">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium hover:underline"
                style={{ color: 'var(--accent-color)' }}
              >
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* bg img right */}
      <div
        className="hidden md:block md:w-1/2 lg:w-2/3 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
    </div>
  );
}
