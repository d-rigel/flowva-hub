import React, { useState } from 'react';
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
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);

  const getToday = dateUtils.formatDateToYYYYMMDD(new Date());
  const getYesterday = dateUtils.formatDateToYYYYMMDD(new Date(Date.now() - 86400000));
  const hasClaimedToday = userData?.last_claim_date === getToday;

  const handleClaimPoints = async () => {
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
      
      const { data, error } = await userService.updateUserData(user.id, updates);
      
      if (error) throw error;
      
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
  };

  return (
    // Updated: Use grid layout with fixed height
    <div className="h-screen bg-gray-50 grid grid-cols-[256px_1fr] overflow-hidden">
      {/* Sidebar - Fixed width, full height */}
      <Sidebar user={user} handleLogout={handleLogout} />
      
      {/* Main Content - Scrollable */}
      <div className="overflow-y-auto">
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
            <EarnPointsTab
              isClaiming={isClaiming}
              userData={userData}
              onClaimPoints={handleClaimPoints}
              claimedToday={claimedToday}
            />
          )}

          {/* Redeem Rewards Tab */}
          {activeTab === 'redeem' && (
            <RedeemRewardsTab userData={userData} />
          )}
        </div>
      </div>

      {/* Claim Points Modal */}
      <ClaimPointsModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
      />
    </div>
  );
};

export default Dashboard;
