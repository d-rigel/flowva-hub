import React from "react";
import { Award, Zap } from "lucide-react";
import { useUserData } from "../../hooks/useUserData";

const PointsBalanceCard = ({userData}) => {
  const points = userData?.points || 0;
  const progress = Math.min((points / 5000) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Award className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="font-semibold text-gray-700">Points Balance</h3>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-5xl font-bold text-purple-600">{points}</div>
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
          🪙
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Progress to $5 Gift Card</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {points}/5000
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {points === 0
            ? "Just getting started — keep earning points!"
            : progress >= 100
            ? "You can redeem a reward!"
            : "Keep going!"}
        </p>
      </div>
    </div>
  );
};

export default PointsBalanceCard;