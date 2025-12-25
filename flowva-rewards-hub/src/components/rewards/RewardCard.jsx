import React from "react";
import { Award } from "lucide-react";

const RewardCard = ({ reward, userPoints }) => {
  const isLocked = reward.status === "locked" && userPoints < reward.points;
  const isUnlocked =
    reward.status === "unlocked" || userPoints >= reward.points;
  const isComingSoon = reward.status === "coming-soon";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="text-5xl mb-4">{reward.icon}</div>

      <h3 className="font-bold text-gray-900 mb-2 text-lg">{reward.name}</h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
        {reward.description}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-yellow-500" />
        <span className="font-semibold text-purple-600">
          {reward.points > 0 ? `${reward.points} pts` : "Free"}
        </span>
      </div>

      <button
        disabled={isLocked || isComingSoon}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
          isComingSoon
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : isLocked
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg"
        }`}
      >
        {isComingSoon ? "Coming Soon" : isLocked ? "Locked" : "Redeem"}
      </button>

      {isLocked && !isComingSoon && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Need {reward.points - userPoints} more points
        </p>
      )}
    </div>
  );
};

export default RewardCard;


