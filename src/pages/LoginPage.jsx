import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import bgImage from '../assets/login.webp';
import logo from '../assets/logo1.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login, user } = useUser();
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      nav('/');
    }
  }, [user, nav]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const mockUser = {
      id: 'u1',
      name: 'Alice',
      email: 'alice@example.com',
      profilePicture: '/images/profiles/alice.jpg',
      bio: 'Passionate about web development and design. I love creating beautiful and functional web applications.',
      facebook: 'https://facebook.com/alice',
      instagram: 'https://instagram.com/alice',
      x: 'https://x.com/alice',
      canTeach: [
        { skill: 'JavaScript', level: 'advanced' },
        { skill: 'UI/UX', level: 'intermediate' },
      ],
      wantsToLearn: [
        { skill: 'Python', level: 'beginner' },
        { skill: 'SEO', level: 'beginner' },
      ],
      connections: ['u2'],
      requestSent: ['u3'],
      requestReceived: ['u2'],
      notifications: [
        {
          type: 'match',
          from: 'u2',
          timestamp: '2025-04-19T13:15:00Z',
          message: 'You matched with Bob!',
        },
      ],
    };

    login(mockUser);
  };

  return (
    <div
      className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <form
        className="bg-white/80 p-8 rounded-lg relative z-10 shadow-lg w-full max-w-sm space-y-4 backdrop-blur-2xl"
        onSubmit={handleSubmit}
      >
        <Link to="/" className="flex items-center rtl:space-x-reverse">
          <img src={logo} className="h-20" alt="Skillswap Logo" />
          <h1 className="font-semibold">Skillswap</h1>
        </Link>
        <button
          type="button"
          onClick={() => alert('For demo only')}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Log in with Google
        </button>

        <div className="flex items-center gap-2">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-amber-950 rounded px-3 py-2 text-gray-800"
          required
        />

        <input
          type="password"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Password"
          className="w-full border border-amber-950 rounded px-3 py-2 text-gray-800"
          required
        />

        <button type="submit" className="w-full text-white py-2 rounded transition">
          Log In
        </button>
        <div className="text-center text-gray-800">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-1 font-medium hover:underline"
            style={{ color: 'var(--accent-color)' }}
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
