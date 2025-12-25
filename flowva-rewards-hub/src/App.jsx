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
    // Only check session, NO user data loading here
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        setCurrentPage('dashboard');
      }
      setAuthLoading(false);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  
  if (event === 'SIGNED_IN' && session) {
    setUser(session.user);
    setCurrentPage('dashboard');
    setTimeout(() => loadUserData(session.user.id), 0);
  }
  
  if (event === 'PASSWORD_RECOVERY') {
    setCurrentPage('reset-password');
  }
  
  if (event === 'SIGNED_OUT') {
    setUser(null);
    setUserData(null);
    setCurrentPage('login');
  }
});


    // Auth listener - NO async/await Supabase calls here!
    // const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    //   console.log('Auth event:', event);
      
    //   if (event === 'SIGNED_IN' && session) {
    //     setUser(session.user);
    //     setCurrentPage('dashboard');
    //     // Defer user data loading with setTimeout to avoid deadlock
    //     setTimeout(() => loadUserData(session.user.id), 0);
    //   }
      
    //   if (event === 'SIGNED_OUT') {
    //     setUser(null);
    //     setUserData(null);
    //     setCurrentPage('login');
    //   }
    // });

    return () => authListener?.subscription?.unsubscribe();
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
  
  if (currentPage === 'dashboard' && user && user.id) {
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






























// ---------------
// import React, { useState, useEffect } from 'react';
// import './App.css';
// import LoadingScreen from './components/common/LoadingScreen';
// import LoginPage from './components/auth/LoginPage';
// import SignUpPage from './components/auth/SignUpPage';
// import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
// import VerificationExpiredPage from './components/auth/VerificationExpiredPage';
// import Dashboard from './components/dashboard/Dashboard';
// import { supabase } from './services/supabase';
// import { userService } from './services/userService'; // Import your user service

// const App = () => {
//   const [currentPage, setCurrentPage] = useState('login');
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(null); // ADD THIS STATE
//   const [loading, setLoading] = useState(true);

//   // Function to load user data
//   const loadUserData = async (userId) => {
//     try {
//       const { data, error } = await userService.getUserData(userId);
//       if (error) {
//         console.error('Error loading user data:', error);
//         // If no data exists, create it
//         const { data: newData } = await userService.createOrGetUserData(userId);
//         setUserData(newData);
//       } else {
//         setUserData(data);
//       }
//     } catch (error) {
//       console.error('Failed to load user data:', error);
//     }
//   };

//   useEffect(() => {
//     checkSession();
    
//     const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log('Auth event:', event);
      
//       if (event === 'SIGNED_IN' && session) {
//         setUser(session.user);
//         // Load user data when signed in
//         if (session.user.id) {
//           await loadUserData(session.user.id);
//         }
//         setCurrentPage('dashboard');
//       }
      
//       if (event === 'SIGNED_OUT') {
//         setUser(null);
//         setUserData(null); // Clear user data on logout
//         setCurrentPage('login');
//       }
//     });

//     return () => {
//       authListener?.subscription?.unsubscribe();
//     };
//   }, []);

//   const checkSession = async () => {
//     const { data } = await supabase.auth.getSession();
//     if (data.session && data.session.user) {
//       setUser(data.session.user);
//       // Load user data on initial session check
//       if (data.session.user.id) {
//         await loadUserData(data.session.user.id);
//       }
//       setCurrentPage('dashboard');
//     }
//     setLoading(false);
//   };

//   const handleLogout = async () => {
//     console.log("Logging out user:", user);
//     await supabase.auth.signOut();
//     setUser(null);
//     setUserData(null); // Clear user data
//     setCurrentPage('login');
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   if (currentPage === 'login') {
//     return <LoginPage onNavigate={setCurrentPage} onLogin={setUser} />;
//   }
  
//   if (currentPage === 'signup') {
//     return <SignUpPage onNavigate={setCurrentPage} />;
//   }
  
//   if (currentPage === 'forgot-password') {
//     return <ForgotPasswordPage onNavigate={setCurrentPage} />;
//   }
  
//   if (currentPage === 'verification-expired') {
//     return <VerificationExpiredPage onNavigate={setCurrentPage} />;
//   }
  
//   if (currentPage === 'dashboard' && user && user.id) {
//     return (
//       <Dashboard 
//         user={user} 
//         userData={userData} // PASS USERDATA HERE
//         setUserData={setUserData} // PASS SETTER TO UPDATE FROM CHILD
//         handleLogout={handleLogout} 
//       />
//     );
//   }

//   return <LoginPage onNavigate={setCurrentPage} onLogin={setUser} />;
// };

// export default App;

















