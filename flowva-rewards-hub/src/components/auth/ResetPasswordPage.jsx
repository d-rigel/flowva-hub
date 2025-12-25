import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Eye, EyeOff, Shield, ShieldOff } from 'lucide-react';
import { supabase } from '../../services/supabase';

const ResetPasswordPage = ({ onNavigate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
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

  // Real-time password validation
  useEffect(() => {
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      match: newPassword === confirmPassword && newPassword.length > 0
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
  }, [newPassword, confirmPassword]);

  const getAccessToken = () => {
    // Check hash first (Supabase default)
    if (window.location.hash.includes('access_token')) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return params.get('access_token');
    }
    
    // Check query params as backup
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('access_token');
  };

  
  // Check for token on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError('No password reset token found. Please use the link from your email.');
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Final validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.number) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

try {
  const { error: updateError } = await supabase.auth.updateUser({ 
    password: newPassword 
  });

  if (updateError) {
    setError('Error: ' + updateError.message);
  } else {
    setSuccess('Password updated! Redirecting...');
    
    //  Clean URL ONLY after success
    window.history.replaceState({}, '', window.location.pathname);
    
    setTimeout(async () => {
      //  Sign out to clear the temporary recovery session
      await supabase.auth.signOut();
      onNavigate('login');
    }, 2000);
  }
} catch (err) {
  setError('An unexpected error occurred.');
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-2">
          <Shield className="w-8 h-8 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold text-purple-700 text-center">Create New Password</h1>
        </div>
        <p className="text-gray-500 text-center mb-6 text-sm">Enter your new password below</p>
        
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

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
              >
                {showNewPassword ? "hide"  : "show"}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
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
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
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
            disabled={loading || passwordStrength < 3 || !passwordChecks.match}
            className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
              loading || passwordStrength < 3 || !passwordChecks.match
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
                Resetting Password...
              </span>
            ) : (
              passwordStrength < 3 ? 'Meet Password Requirements' :
              !passwordChecks.match ? 'Passwords Must Match' :
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign in
            </button>
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            After resetting, you'll be logged out from all devices for security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;








