import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { AlertCircle, Mail, RefreshCw } from 'lucide-react';

const EmailVerificationPage = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 

  const resendVerificationEmail = async () => {
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: supabase.auth.getUser()?.data?.user?.email,
      options: {
        redirectTo: `${window.location.origin}/verify-email`
      }
    });

    if (error) {
      setMessageType('error');
      setMessage('Failed to resend email: ' + error.message);
    } else {
      setMessageType('success');
      setMessage('Verification email sent! Check your inbox.');
    }
    setLoading(false);
  };

  const checkVerificationStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
      setMessageType('success');
      setMessage('Email verified! Redirecting to dashboard...');
      setTimeout(() => onNavigate('dashboard'), 2000);
    }
  };

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-purple-700 mb-2">Verify your email</h1>
          <p className="text-gray-500 text-sm">
            Check your inbox for a verification link. 
            Didn't receive it?
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-3 border rounded-lg flex items-center gap-2 text-sm ${
            messageType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <button
          onClick={resendVerificationEmail}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sending email...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Resend verification email
            </>
          )}
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already verified?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Go to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
