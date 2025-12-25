import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Sidebar from './Sidebar';
import Header from './Header';
import EarnPointsTab from '../rewards/EarnPointsTab';
import RedeemRewardsTab from '../rewards/RedeemRewardsTab';
import ClaimPointsModal from '../rewards/ClaimPointsModal';
import { dateUtils } from '../../utils/dateUtils';

const Dashboard = ({ user, userData, setUserData, handleLogout }) => {
const [activeTab, setActiveTab] = useState('earn');
const [showClaimModal, setShowClaimModal] = useState(false);
const [rewardsTab, setRewardsTab] = useState('all');
 const [isClaiming, setIsClaiming] = useState(false)
const [claimedToday, setClaimedToday] = useState(false);


 
const getToday = dateUtils.formatDateToYYYYMMDD(new Date());
const getYesterday = dateUtils.formatDateToYYYYMMDD(new Date(Date.now() - 86400000));
const hasClaimedToday = userData?.last_claim_date === getToday;

const handleClaimPoints = async () => {

// const getToday = dateUtils.formatDateToYYYYMMDD(new Date());
// const getYesterday = dateUtils.formatDateToYYYYMMDD(new Date(Date.now() - 86400000));
// const hasClaimedToday = userData?.last_claim_date === getToday;

  console.log("getToday:", getToday);
  console.log("getYesterday:", getYesterday);
  console.log("hasClaimedToday:", hasClaimedToday);


//   if (claimedToday || isClaiming) return;

//   setIsClaiming(true); // Start loading


    if (isClaiming) return;
    setIsClaiming(true);

    if (hasClaimedToday) {
      setClaimedToday(true);
      return;
    }


 try {
      
      const updates = {
        points: (userData?.points || 0) + 5,
        daily_streak: userData?.last_claim_date === getYesterday 
          ? (userData?.daily_streak || 0) + 1 
          : 1,
        last_claim_date: getToday,
        points_earned: (userData?.points_earned || 0) + 5,
      };
      
      // 3. USE YOUR USER SERVICE
      const { data, error } = await userService.updateUserData(user.id, updates);
      
      if (error) throw error;
      
      // 4. UPDATE LOCAL STATE
      if (data) {
        setUserData({
          ...userData,
          ...data
        });
        setShowClaimModal(true);
      }
      
    } catch (error) {
      console.error("Claim points error:", error);
      alert(error.message || "Failed to claim points");
    } finally {
      setIsClaiming(false);
    }

    
//     try {
 
// //   const getToday = dateUtils.formatDateToYYYYMMDD(new Date());
// //   const getYesterday = () => formatDateToYYYYMMDD(new Date(Date.now() - 86400000));
// //   const hasClaimedToday = userData?.last_claim_date === getToday();



// //   const today = new Date().toISOString().split('T')[0]; // "2025-12-24"
// //   const lastClaim = userData?.last_claim_date; // Already "2025-12-24"
//     //   const today = new Date().toDateString();
//     //   const lastClaim = userData?.last_claim_date; 
      

//      if (isClaiming || hasClaimedToday) {
//       console.log("Already claimed today or in progress");
//       return;
//     }

//     setIsClaiming(true);

//   const newPoints = (userData?.points || 0) + 5;
//   const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
//   const newStreak = lastClaim === yesterday 
//     ? (userData?.daily_streak || 0) + 1 
//     : 1;    

//     //   const newPoints = (userData?.points || 0) + 5;
//     //   const yesterday = new Date(Date.now() - 86400000).toDateString();
//     //   const newStreak = lastClaim === yesterday 
//     //     ? (userData?.daily_streak || 0) + 1 
//     //     : 1;

//       const updates = {
//         points: newPoints,
//         daily_streak: newStreak,
//         last_claim_date: today,
//         points_earned: (userData?.points_earned || 0) + 5,
//       };

//       const { data, error } = await userService.updateUserData(user.id, updates);

//       if (error) {
//         console.error("Error updating points:", error);
//         alert("Failed to claim points. Please try again.");
//         return;
//       }

//       // to Update my local state with the returned data
//       if (data) {
//         setUserData({
//           ...userData,
//           ...data
//         });
//       }

//       setShowClaimModal(true);
//     } catch (error) {
//       console.error("Claim points error:", error);
//       alert("An unexpected error occurred. Please try again.");
//     } finally {
//       setIsClaiming(false);
//     }
  };
//   const handleClaimPoints = async () => {
//   const today = new Date().toDateString();
//   const lastClaim = userData?.last_claim_date; 
  
//   console.log("Last Claim Date:", lastClaim);
//   console.log("Today:", today);
//   console.log("User ID:", user.id);

//   if (lastClaim === today) {
//     console.log("Already claimed today!");
//     return;
//   }

//   const newPoints = (userData?.points || 0) + 5;
//   const yesterday = new Date(Date.now() - 86400000).toDateString();
//   const newStreak = lastClaim === yesterday 
//     ? (userData?.daily_streak || 0) + 1 
//     : 1;

//   console.log("Updating database with:", {
//     points: newPoints,
//     daily_streak: newStreak,
//     last_claim_date: today,
//     points_earned: (userData?.points_earned || 0) + 5
//   });


//   const { data, error } = await supabase
//     .from('user_data')
//     .update({
//       points: newPoints,
//       daily_streak: newStreak,
//       last_claim_date: today,
//       points_earned: (userData?.points_earned || 0) + 5,
//       updated_at: new Date().toISOString()
//     })
//     .eq('user_id', user.id)
//     .select();

//   if (error) {
//     console.error("Error updating points:", error);
//     alert("Failed to claim points. Please try again.");
//     return;
//   }


//   // Update local state with snake_case to match database
//   setUserData({
//     ...userData,
//     points: newPoints,
//     daily_streak: newStreak,
//     last_claim_date: today,
//     points_earned: (userData?.points_earned || 0) + 5,
//     updated_at: new Date().toISOString()
//   });

//   setShowClaimModal(true);
// };



//   const canClaimToday = userData?.last_claim_date !== new Date().toDateString();

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
      <Sidebar user={user} handleLogout={handleLogout}  />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Header />

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('earn')}
              className={`pb-4 px-2 font-semibold transition-colors relative ${
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
              className={`pb-4 px-2 font-semibold transition-colors relative ${
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
             <EarnPointsTab
             isClaiming={isClaiming}
             userData={userData}
              onClaimPoints={handleClaimPoints}
            claimedToday={claimedToday}
             />
            </>
          )}

          {/* Redeem Rewards Tab */}
          {activeTab === 'redeem' && (
            <>
            <RedeemRewardsTab userData={userData} />
            </>
          )}
        </div>
      </div>

      {/* Claim Points Modal */}
      <>
      <ClaimPointsModal
       isOpen={showClaimModal}
       onClose={() => setShowClaimModal(false)}
       />
      </>
    </div>
  );
};


export default Dashboard;
















