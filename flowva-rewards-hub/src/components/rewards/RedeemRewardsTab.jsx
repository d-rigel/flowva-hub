import React, { useState } from "react";
import RewardCard from "./RewardCard";

const RedeemRewardsTab = ({ userData }) => {
  const [rewardsTab, setRewardsTab] = useState("all");

  const rewards = [
    {
      id: 1,
      name: "$5 Bank Transfer",
      icon: "💰",
      points: 5000,
      status: "locked",
      description:
        "The $5 equivalent will be transferred to your bank account.",
    },
    {
      id: 2,
      name: "$5 PayPal International",
      icon: "💰",
      points: 5000,
      status: "locked",
      description:
        "Receive a $5 PayPal balance transfer directly to your PayPal account email.",
    },
    {
      id: 3,
      name: "$5 Virtual Visa Card",
      icon: "🎁",
      points: 5000,
      status: "locked",
      description:
        "Use your $5 prepaid card to shop anywhere Visa is accepted online.",
    },
    {
      id: 4,
      name: "$5 Apple Gift Card",
      icon: "🎁",
      points: 5000,
      status: "locked",
      description:
        "Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.",
    },
    {
      id: 5,
      name: "$5 Google Play Card",
      icon: "🎁",
      points: 5000,
      status: "locked",
      description:
        "Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.",
    },
    {
      id: 6,
      name: "$5 Amazon Gift Card",
      icon: "🎁",
      points: 5000,
      status: "locked",
      description:
        "Get a $5 digital gift card to spend on your favorite tools or platforms.",
    },
    {
      id: 7,
      name: "$10 Amazon Gift Card",
      icon: "🎁",
      points: 10000,
      status: "locked",
      description:
        "Get a $10 digital gift card to spend on your favorite tools or platforms.",
    },
    {
      id: 8,
      name: "Free Udemy Course",
      icon: "📚",
      points: 0,
      status: "coming-soon",
      description: "Coming Soon!",
    },
  ];

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

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userPoints={userData?.points || 0}
          />
        ))}
      </div>
    </>
  );
};

export default RedeemRewardsTab;