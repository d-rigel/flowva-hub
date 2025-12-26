import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { AlertCircle, CheckCircle, Shield, ShieldOff } from 'lucide-react';
import { helpers } from '../../utils/helpers';

const SignUpPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Real-time validation states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    match: false
  });
  const [strengthColor, setStrengthColor] = useState('bg-gray-200');
  const [strengthText, setStrengthText] = useState('Password Strength');
  const [strengthTextColor, setStrengthTextColor] = useState('text-gray-600');
  const [emailValid, setEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Real-time password validation
  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      match: password === confirmPassword && password.length > 0
    };
    
    setPasswordChecks(checks);
    
    // Calculate strength score (0-4)
    const strength = Object.values(checks).filter(Boolean).length - (checks.match ? 1 : 0);
    setPasswordStrength(strength);
    
    // Update strength indicators
    switch(strength) {
      case 0:
        setStrengthColor('bg-gray-200');
        setStrengthText('Very Weak');
        setStrengthTextColor('text-gray-600');
        break;
      case 1:
        setStrengthColor('bg-red-500');
        setStrengthText('Weak');
        setStrengthTextColor('text-red-600');
        break;
      case 2:
        setStrengthColor('bg-yellow-500');
        setStrengthText('Fair');
        setStrengthTextColor('text-yellow-600');
        break;
      case 3:
        setStrengthColor('bg-blue-500');
        setStrengthText('Good');
        setStrengthTextColor('text-blue-600');
        break;
      case 4:
        setStrengthColor('bg-green-500');
        setStrengthText('Strong');
        setStrengthTextColor('text-green-600');
        break;
      default:
        setStrengthColor('bg-gray-200');
        setStrengthText('Password Strength');
        setStrengthTextColor('text-gray-600');
    }
  }, [password, confirmPassword]);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Final validation
    if (!emailValid) {
      setError('Please enter a valid email address');
      setEmailTouched(true);
      return;
    }

    if (!passwordChecks.match) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      setError('Please meet all password requirements for a stronger password');
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Check what we got back
    if (data.user && data.session) {
      setSuccess('Account created and logged in! Redirecting...');
      setTimeout(() => {
        window.location.reload(); // Let App.js handle the redirect
      }, 1500);
    } else if (data.user && !data.session) {
      setSuccess('Verification email sent. Please check your inbox to confirm your email address.');
    }
    
    // Clear form only if successful
    if (!signUpError) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setEmailTouched(false);
      setPasswordStrength(0);
      setPasswordChecks({
        length: false,
        uppercase: false,
        number: false,
        match: false
      });
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`
      }
    });
    
    if (oauthError) {
      setError(oauthError.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-2">
          <Shield className="w-8 h-8 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold text-purple-700 text-center">Create Your Account</h1>
        </div>
        <p className="text-gray-500 text-center mb-6 text-sm">Sign up to manage your tools</p>
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailTouched(true);
              }}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                emailTouched ? 
                  (emailValid ? 'border-green-300' : 'border-red-300') : 
                  'border-gray-300'
              }`}
              required
            />
            {emailTouched && !emailValid && (
              <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
            )}
            {emailTouched && emailValid && (
              <p className="mt-1 text-xs text-green-500 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" /> Valid email format
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${strengthTextColor}`}>
                    {strengthText}
                  </span>
                  <span className="text-xs text-gray-500">
                    {passwordStrength}/4 checks passed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${strengthColor} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                
                {/* Password Requirements */}
                <div className="mt-3 space-y-1">
                  <div className={`flex items-center text-xs ${passwordChecks.length ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordChecks.length ? <CheckCircle className="w-3 h-3 mr-2" /> : <div className="w-3 h-3 mr-2 rounded-full border border-gray-400" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center text-xs ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordChecks.uppercase ? <CheckCircle className="w-3 h-3 mr-2" /> : <div className="w-3 h-3 mr-2 rounded-full border border-gray-400" />}
                    At least one uppercase letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordChecks.number ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordChecks.number ? <CheckCircle className="w-3 h-3 mr-2" /> : <div className="w-3 h-3 mr-2 rounded-full border border-gray-400" />}
                    At least one number
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                  confirmPassword ? 
                    (passwordChecks.match ? 'border-green-300' : 'border-red-300') : 
                    'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
              >
                {showConfirmPassword ? "hide" : "show"}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className={`mt-2 flex items-center text-sm ${passwordChecks.match ? 'text-green-600' : 'text-red-600'}`}>
                {passwordChecks.match ? 
                  <><CheckCircle className="w-4 h-4 mr-1" /> Passwords match</> :
                  <><AlertCircle className="w-4 h-4 mr-1" /> Passwords don't match</>
                }
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !emailValid || passwordStrength < 3 || !passwordChecks.match}
            className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
              loading || !emailValid || passwordStrength < 3 || !passwordChecks.match
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              !emailValid ? 'Enter Valid Email' :
              passwordStrength < 3 ? 'Meet Password Requirements' :
              !passwordChecks.match ? 'Passwords Must Match' :
              'Sign up Account'
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 font-medium text-gray-700 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Already have an account{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Log In
            </button>
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;




