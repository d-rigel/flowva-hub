import React, { useState, useEffect } from 'react';
import './App.css';
import LoadingScreen from './components/common/LoadingScreen';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import VerificationExpiredPage from './components/auth/VerificationExpiredPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import Dashboard from './components/dashboard/Dashboard';
import { supabase } from './services/supabase';
import { userService } from './services/userService'; // Import your user service

const App = () => {
  
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);  // Separate auth loading
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Load user data WITHOUT blocking auth flow
  const loadUserData = async (userId) => {
    if (!userId) return;
    setUserDataLoading(true);
    try {
      const { data, error } = await userService.getUserData(userId);
      if (error) {
        const { data: newData } = await userService.createOrGetUserData(userId);
        setUserData(newData);
      } else {
        setUserData(data);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setUserDataLoading(false);
    }
  };


  useEffect(() => {
  const checkUrlHash = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    if (params.get('type') === 'recovery') {
      setCurrentPage('reset-password');
      return true; 
    }
    // check for email verification 
    if (params.get('type') === 'signup') {
      setCurrentPage('verify-email');
      window.history.replaceState({}, '', window.location.pathname);
      return true;
    }
    return false; 
  };

  // Check hash immediately on mount
  const hashWasProcessed = checkUrlHash();

  //checking for existing session if no auth hash was found
  const checkSession = async () => {
    if (!hashWasProcessed) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        setCurrentPage('dashboard');
      }
    }
    setAuthLoading(false);
  };
  
  checkSession();

  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    
    switch (event) {
      case 'PASSWORD_RECOVERY':
        setCurrentPage('reset-password');
        break;
        
      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
        if (session?.user && currentPage !== 'reset-password') {
          setUser(session.user);
          setCurrentPage('dashboard');
        }
        break;
        
      case 'SIGNED_OUT':
        setUser(null);
        setUserData(null);
        setCurrentPage('login');
        break;

      case 'SIGNED_UP':
        setUser(null);
        setUserData(null);
        setCurrentPage('login');
        break;
       
      case 'USER_CONFIRMATION_EXPIRED':
        setUser(null);
        setUserData(null);
        setCurrentPage('verification-expired');
        break;
      default:
        break;
    }
  });

  return () => {
    authListener?.subscription?.unsubscribe();
  };
}, []);


  // Separate effect for loading user data when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    }
  }, [user?.id]);

    const handleLogout = async () => {
    console.log("Logging out user:", user);
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null); 
    setCurrentPage('login');
  };


  // Show loading if auth is still checking OR user data is loading on dashboard
  if (authLoading || (currentPage === 'dashboard' && userDataLoading)) {
    return <LoadingScreen />;
  }
  if (currentPage === 'login') {
    return <LoginPage onNavigate={setCurrentPage} onLogin={setUser} />;
  }
  
  if (currentPage === 'signup') {
    return <SignUpPage onNavigate={setCurrentPage} />;
  }
  
  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'reset-password') {
    return <ResetPasswordPage onNavigate={setCurrentPage} />;
  }
  
  if (currentPage === 'verification-expired') {
    return <VerificationExpiredPage onNavigate={setCurrentPage} />;
  }


  if (currentPage === 'dashboard' && user) {
  return (
    <Dashboard 
      user={user} 
      userData={userData}
      setUserData={setUserData}
      handleLogout={handleLogout} 
    />
  );
}


  return <LoginPage onNavigate={setCurrentPage} onLogin={setUser} />;
};

export default App;




























