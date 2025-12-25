import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Home, Compass, BookOpen, Layers, CreditCard, Gift, Settings, Bell, X, CheckCircle, AlertCircle, Clock, Share2, Users, Zap, Calendar, Award, Menu } from 'lucide-react';

// ==================== DATA & STATE MANAGEMENT ====================
const useAuthState = () => {
  const [users, setUsers] = useState({});
  const [sessions, setSessions] = useState({});
  const [userData, setUserData] = useState({});
  const [currentSession, setCurrentSession] = useState(null);

  const supabase = {
    auth: {
      signUp: async ({ email, password }) => {
        if (users[email]) {
          return { error: { message: 'User already exists' } };
        }
        
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
          return { error: { message: 'Password must be at least 8 characters with uppercase and numbers' } };
        }
        
        const userId = 'user_' + Date.now();
        setUsers(prev => ({
          ...prev,
          [email]: { id: userId, email, password, verified: false, verificationSent: Date.now() }
        }));
        
        setUserData(prev => ({
          ...prev,
          [userId]: {
            points: 0,
            dailyStreak: 0,
            lastClaimDate: null,
            referrals: 0,
            pointsEarned: 0,
            firstName: email.split('@')[0]
          }
        }));
        
        return { data: { user: { id: userId, email } }, error: null };
      },
      
      signInWithPassword: async ({ email, password }) => {
        const user = users[email];
        if (!user || user.password !== password) {
          return { error: { message: 'Invalid credentials' } };
        }
        if (!user.verified) {
          return { error: { message: 'Please verify your email first' } };
        }
        
        const sessionId = 'session_' + Date.now();
        setSessions(prev => ({
          ...prev,
          [sessionId]: { userId: user.id, email, createdAt: Date.now() }
        }));
        setCurrentSession(sessionId);
        
        return { data: { user: { id: user.id, email }, session: { id: sessionId } }, error: null };
      },
      
      signInWithOAuth: async ({ provider }) => {
        const email = `${provider}user@example.com`;
        const userId = 'user_oauth_' + Date.now();
        
        setUsers(prev => ({
          ...prev,
          [email]: { id: userId, email, verified: true }
        }));
        
        setUserData(prev => ({
          ...prev,
          [userId]: {
            points: 0,
            dailyStreak: 0,
            lastClaimDate: null,
            referrals: 0,
            pointsEarned: 0,
            firstName: provider.charAt(0).toUpperCase() + provider.slice(1) + 'User'
          }
        }));
        
        const sessionId = 'session_' + Date.now();
        setSessions(prev => ({
          ...prev,
          [sessionId]: { userId, email, createdAt: Date.now() }
        }));
        setCurrentSession(sessionId);
        
        return { data: { user: { id: userId, email }, session: { id: sessionId } }, error: null };
      },
      
      resetPasswordForEmail: async ({ email }) => {
        if (!users[email]) {
          return { error: { message: 'Email not found' } };
        }
        return { data: {}, error: null };
      },
      
      signOut: async () => {
        setCurrentSession(null);
        return { error: null };
      },
      
      getSession: async () => {
        if (!currentSession || !sessions[currentSession]) {
          return { data: { session: null }, error: null };
        }
        const session = sessions[currentSession];
        const user = Object.values(users).find(u => u.id === session.userId);
        return { data: { session, user }, error: null };
      }
    },
    
    from: (table) => ({
      select: () => ({
        eq: (field, value) => ({
          single: async () => {
            const session = sessions[currentSession];
            if (session && userData[session.userId]) {
              return { data: userData[session.userId], error: null };
            }
            return { data: null, error: { message: 'Not found' } };
          }
        })
      }),
      
      update: (data) => ({
        eq: async (field, value) => {
          const session = sessions[currentSession];
          if (session) {
            setUserData(prev => ({
              ...prev,
              [session.userId]: { ...prev[session.userId], ...data }
            }));
            return { data: { ...userData[session.userId], ...data }, error: null };
          }
          return { data: null, error: { message: 'Unauthorized' } };
        }
      })
    })
  };

  return supabase;
};

// ==================== COMMON COMPONENTS ====================
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      <p className="text-white mt-4 text-lg">Loading...</p>
    </div>
  </div>
);

const Alert = ({ type, message, icon: Icon }) => (
  <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
    type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
  }`}>
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 text-sm"
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

// ==================== AUTH PAGES ====================
const LoginPage = ({ onNavigate, onLogin, supabase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onLogin(data.user);
    setTimeout(() => onNavigate('dashboard'), 500);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    
    if (!error && data.user) {
      onLogin(data.user);
      setTimeout(() => onNavigate('dashboard'), 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-700 text-center mb-2">Log in to flowva</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Log in to receive personalized recommendations</p>
        
        {error && <Alert type="error" message={error} icon={AlertCircle} />}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="········"
            />
          </div>

          <div className="text-right mb-6">
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 font-medium text-gray-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

const SignUpPage = ({ onNavigate, supabase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess('Verification email sent. Please check your inbox.');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-700 text-center mb-2">Create Your Account</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Sign up to manage your tools</p>
        
        {success && <Alert type="success" message={success} icon={CheckCircle} />}
        {error && <Alert type="error" message={error} icon={AlertCircle} />}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="········"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="········"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

const ForgotPasswordPage = ({ onNavigate, supabase }) => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess('Password reset link sent! Please check your email.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-700 text-center mb-2">Reset Password</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Enter your email to receive a reset link</p>
        
        {success && <Alert type="success" message={success} icon={CheckCircle} />}
        {error && <Alert type="error" message={error} icon={AlertCircle} />}

        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

const VerificationExpiredPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border-t-4 border-red-500">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Clock className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Verification Link Expired</h1>
          <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
            The verification link you used has expired or invalid. Please request a new verification link if your account is yet to be verified.
          </p>

          <button
            onClick={() => onNavigate('login')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Resend Verification Link
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== DASHBOARD COMPONENTS ====================
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
      active
        ? 'bg-purple-100 text-purple-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const RewardCard = ({ reward, userPoints }) => {
  const isLocked = reward.status === 'locked' && userPoints < reward.points;
  const isComingSoon = reward.status === 'coming-soon';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="text-4xl sm:text-5xl mb-4">{reward.icon}</div>
      <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{reward.name}</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{reward.description}</p>
      
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-yellow-500" />
        <span className="font-semibold text-purple-600 text-sm">{reward.points} pts</span>
      </div>

      <button
        disabled={isLocked || isComingSoon}
        className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
          isComingSoon
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : isLocked
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isComingSoon ? 'Coming Soon' : isLocked ? 'Locked' : 'Redeem'}
      </button>
    </div>
  );
};

const Dashboard = ({ user, onLogout, supabase }) => {
  const [activeTab, setActiveTab] = useState('earn');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [rewardsTab, setRewardsTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data } = await supabase.from('user_data').select('*').eq('user_id', user.id).single();
    if (data) {
      setUserData(data);
    }
  };

  const handleClaimPoints = async () => {
    const today = new Date().toDateString();
    const lastClaim = userData?.lastClaimDate;
    
    if (lastClaim === today) {
      return;
    }

    const newPoints = (userData?.points || 0) + 5;
    const newStreak = lastClaim === new Date(Date.now() - 86400000).toDateString() 
      ? (userData?.dailyStreak || 0) + 1 
      : 1;

    await supabase.from('user_data').update({
      points: newPoints,
      dailyStreak: newStreak,
      lastClaimDate: today,
      pointsEarned: (userData?.pointsEarned || 0) + 5
    }).eq('user_id', user.id);

    setUserData({ ...userData, points: newPoints, dailyStreak: newStreak, lastClaimDate: today, pointsEarned: (userData?.pointsEarned || 0) + 5 });
    setShowClaimModal(true);
  };

  const canClaimToday = userData?.lastClaimDate !== new Date().toDateString();

  const rewards = [
    { id: 1, name: '$5 Bank Transfer', icon: '💰', points: 5000, status: 'locked', description: 'The $5 equivalent will be transferred to your bank account.' },
    { id: 2, name: '$5 PayPal International', icon: '💰', points: 5000, status: 'locked', description: 'Receive a $5 PayPal balance transfer directly to your PayPal account email.' },
    { id: 3, name: '$5 Virtual Visa Card', icon: '🎁', points: 5000, status: 'locked', description: 'Use your $5 prepaid card to shop anywhere Visa is accepted online.' },
    { id: 4, name: '$5 Apple Gift Card', icon: '🎁', points: 5000, status: 'locked', description: 'Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.' },
    { id: 5, name: '$5 Google Play Card', icon: '🎁', points: 5000, status: 'locked', description: 'Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.' },
    { id: 6, name: '$5 Amazon Gift Card', icon: '🎁', points: 5000, status: 'locked', description: 'Get a $5 digital gift card to spend on your favorite tools or platforms.' },
    { id: 7, name: '$10 Amazon Gift Card', icon: '🎁', points: 10000, status: 'locked', description: 'Get a $10 digital gift card to spend on your favorite tools or platforms.' },
    { id: 8, name: 'Free Udemy Course', icon: '📚', points: 0, status: 'coming-soon', description: 'Coming Soon!' }
  ];

  const filteredRewards = rewards.filter(reward => {
    if (rewardsTab === 'all') return true;
    if (rewardsTab === 'unlocked') return reward.status === 'unlocked';
    if (rewardsTab === 'locked') return reward.status === 'locked';
    if (rewardsTab === 'coming-soon') return reward.status === 'coming-soon';
    return true;
  });

  const getTabCount = (tab) => {
    if (tab === 'all') return rewards.length;
    return rewards.filter(r => {
      if (tab === 'unlocked') return r.status === 'unlocked';
      if (tab === 'locked') return r.status === 'locked';
      if (tab === 'coming-soon') return r.status === 'coming-soon';
      return false;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="text-xl font-bold text-purple-700">Flowva</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <NavItem icon={<Home size={20} />} label="Home" />
          <NavItem icon={<Compass size={20} />} label="Discover" />
          <NavItem icon={<BookOpen size={20} />} label="Library" />
          <NavItem icon={<Layers size={20} />} label="Tech Stack" />
          <NavItem icon={<CreditCard size={20} />} label="Subscriptions" />
          <NavItem icon={<Gift size={20} />} label="Rewards Hub" active />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
              {userData?.firstName?.charAt(0) || 'E'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">{userData?.firstName || 'Emmanuel'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="text-lg font-bold text-purple-700">Flowva</span>
          </div>
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Rewards Hub</h1>
              <p className="text-gray-600 text-sm sm:text-base">Earn points, unlock rewards, and celebrate your progress!</p>
            </div>
            <button className="relative hidden lg:block">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 sm:gap-6 border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('earn')}
              className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'earn'
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Earn Points
              {activeTab === 'earn' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('redeem')}
              className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'redeem'
                  ? 'text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Redeem Rewards
              {activeTab === 'redeem' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
              )}
            </button>
          </div>

          {/* Earn Points Tab */}
          {activeTab === 'earn' && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-purple-600 pl-4">Your Rewards Journey</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Points Balance */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Points Balance</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl sm:text-5xl font-bold text-purple-600">{userData?.points || 0}</div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                      🪙
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Progress to $5 Gift Card</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((userData?.points || 0) / 5000 * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">{userData?.points || 0}/5000</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Just getting started – keep earning points!
                    </p>
                  </div>
                </div>

                {/* Daily Streak */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Daily Streak</h3>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-purple-600 mb-4">{userData?.dailyStreak || 0} day</div>
                  
                  <div className="flex gap-1 sm:gap-2 mb-4">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                          i === 6 ? 'bg-purple-600 text-white ring-2 ring-purple-300' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">Check in daily to earn +5 points</p>
                  <button
                    onClick={handleClaimPoints}
                    disabled={!canClaimToday}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    {canClaimToday ? "Claim Today's Points" : "Come back tomorrow"}
                  </button>
                </div>

                {/* Top Tool Spotlight */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl p-4 sm:p-6 shadow-lg text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Top Tool Spotlight</h3>
                  <p className="text-xl sm:text-2xl font-bold mb-3">Reclaim</p>
                  
                  <div className="flex items-start gap-3 mb-4">
                    <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Automate and Optimize Your Schedule. Reclaim.ai is an AI-powered calendar assistant that automatically schedules your tasks, meetings, and breaks to boost productivity. Free to try – earn Flowva Points when you sign up!
                    </p>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3">
                    <button className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-2 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign up</span>
                    </button>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-4 sm:px-6 py-2 rounded-lg font-semibold transition duration-200 flex items-center gap-2 text-sm">
                      <Gift className="w-4 h-4" />
                      Claim 50 pts
                    </button>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Earn More Points */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-purple-600 pl-4">Earn More Points</h2>
              
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Refer and win 10,000 points!</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                      Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners of <span className="font-semibold text-purple-600">10,000 points</span>. Friends must complete onboarding to qualify.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">Share Your Stack</h3>
                      <span className="text-xs sm:text-sm font-semibold text-gray-600">Earn +25 pts</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">Share your tool stack</p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition duration-200 flex items-center gap-2 text-sm">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Refer & Earn */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-purple-600 pl-4">Refer & Earn</h2>
              
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4 mb-6">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Share Your Link</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Invite friends and earn 25 points when they join!</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">{userData?.referrals || 0}</div>
                    <p className="text-xs sm:text-sm text-gray-600">Referrals</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">{userData?.pointsEarned || 0}</div>
                    <p className="text-xs sm:text-sm text-gray-600">Points Earned</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Your personal referral link:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`https://flowvahub.com/ref/${user.id}`}
                      readOnly
                      className="flex-1 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm"
                    />
                    <button className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition duration-200 text-xs sm:text-sm whitespace-nowrap">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Redeem Rewards Tab */}
          {activeTab === 'redeem' && (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 border-l-4 border-purple-600 pl-4">Redeem Your Points</h2>
              
              {/* Rewards Sub-tabs */}
              <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
                {[
                  { key: 'all', label: 'All Rewards' },
                  { key: 'unlocked', label: 'Unlocked' },
                  { key: 'locked', label: 'Locked' },
                  { key: 'coming-soon', label: 'Coming Soon' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setRewardsTab(tab.key)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap text-xs sm:text-sm ${
                      rewardsTab === tab.key
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      rewardsTab === tab.key
                        ? 'bg-white/20'
                        : 'bg-gray-200'
                    }`}>
                      {getTabCount(tab.key)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredRewards.map(reward => (
                  <RewardCard key={reward.id} reward={reward} userPoints={userData?.points || 0} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Claim Points Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center relative animate-[fadeIn_0.3s_ease-out]">
            <button
              onClick={() => setShowClaimModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">Level Up! 🎉</h2>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600 mb-4">+5 Points</p>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl">👑</span>
              <span className="text-2xl">💎</span>
              <span className="text-2xl">🎯</span>
            </div>

            <p className="text-sm sm:text-base text-gray-600 mb-6">You've claimed your daily points! Come back tomorrow for more!</p>

            <button
              onClick={() => setShowClaimModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = useAuthState();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setUser(data.user);
      setCurrentPage('dashboard');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={setCurrentPage} onLogin={setUser} supabase={supabase} />;
  }
  
  if (currentPage === 'signup') {
    return <SignUpPage onNavigate={setCurrentPage} supabase={supabase} />;
  }
  
  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={setCurrentPage} supabase={supabase} />;
  }
  
  if (currentPage === 'verification-expired') {
    return <VerificationExpiredPage onNavigate={setCurrentPage} />;
  }
  
  if (currentPage === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} supabase={supabase} />;
  }

  return <LoginPage onNavigate={setCurrentPage} onLogin={setUser} supabase={supabase} />;
};

export default App;