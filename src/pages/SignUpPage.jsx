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
    <div className="flex w-screen h-screen absolute inset-0 overflow-hidden">
      {/* left */}
      <div
        className="hidden md:block w-1/2 h-full bg-cover"
        style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: '90% center' }}
      ></div>

      {/* right */}
      <div className="w-full md:w-1/2 h-full flex flex-col bg-white p-8 overflow-y-auto">
        {/* logo on top */}
        <div className="mb-2">
          <Link to="/" className="flex items-center justify-center">
            <img src={logo} className="h-16" alt="Skillswap Logo" />
            <h1 className="font-semibold">Skillswap</h1>
          </Link>
        </div>

        {/* form */}
        <div className="flex-grow flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
            <p className="text-2xl font-semibold text-gray-800 text-left">
              Join 1500+ teachers and learners who earn & learn with us.
            </p>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
              onClick={() => alert('for demo only')}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>

            <div className="flex items-center gap-2">
              <hr className="flex-grow border-gray-300" />
              <span className="text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded text-white"
              style={{ backgroundColor: 'var(--primary-color)' }}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>

            {/* terms */}
            <p className="text-sm text-gray-500 text-left">
              You agree to our{' '}
              <a href="/terms" className="underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
              .
            </p>

            {/* signIn */}
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
    </div>
  );
}
