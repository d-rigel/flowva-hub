import React from 'react'

const VerificationExpiredPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-t-4 border-red-500">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Clock className="w-8 h-8 text-red-600" />
          </div>
          
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto mb-4" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#8B5CF6"/>
              <path d="M30 35 Q35 25 45 28 L55 32 Q58 28 65 30 M35 40 Q40 45 45 45 M55 45 Q60 45 65 40" stroke="white" strokeWidth="3" fill="none"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verification Link Expired</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
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

export default VerificationExpiredPage
