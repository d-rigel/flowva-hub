
import React, { useState, useEffect } from "react";
import RewardCard from "./RewardCard";
import { rewardsService } from "../../services/rewardsService";

const RedeemRewardsTab = ({ userData }) => {
  const [rewardsTab, setRewardsTab] = useState("all");
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const { data, error } = await rewardsService.getAllRewards();
        
        if (error) throw error;
        
        setRewards(data || []);
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const filteredRewards = rewards.filter((reward) => {
    if (rewardsTab === "all") return true;
    if (rewardsTab === "unlocked") return reward.status === "unlocked";
    if (rewardsTab === "locked") return reward.status === "locked";
    if (rewardsTab === "coming-soon") return reward.status === "coming-soon";
    return true;
  });

  const getTabCount = (tab) => {
    if (tab === "all") return rewards.length;
    return rewards.filter((r) => {
      if (tab === "unlocked") return r.status === "unlocked";
      if (tab === "locked") return r.status === "locked";
      if (tab === "coming-soon") return r.status === "coming-soon";
      return false;
    }).length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">Error loading rewards</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
        Redeem Your Points
      </h2>

      {/* Rewards Sub-tabs */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {[
          { key: "all", label: "All Rewards" },
          { key: "unlocked", label: "Unlocked" },
          { key: "locked", label: "Locked" },
          { key: "coming-soon", label: "Coming Soon" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setRewardsTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              rewardsTab === tab.key
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                rewardsTab === tab.key ? "bg-white/20" : "bg-gray-200"
              }`}
            >
              {getTabCount(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredRewards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No rewards found in this category</p>
        </div>
      ) : (
        /* Rewards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userPoints={userData?.points || 0}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default RedeemRewardsTab;


