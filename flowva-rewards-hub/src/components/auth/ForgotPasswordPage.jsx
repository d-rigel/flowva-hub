import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPasswordPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error } = await authService.resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess('Password reset link sent! Please check your email.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-700 text-center mb-2">Reset Password</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Enter your email to receive a reset link</p>
        
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

export default ForgotPasswordPage;