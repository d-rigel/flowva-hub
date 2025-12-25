import React from "react";
import { Calendar, Zap } from "lucide-react";


const DailyStreakCard = ({ userData, onClaimPoints, claimedToday, isClaiming }) => {
console.log("isClaiming in DailyStreakCard:", isClaiming);
console.log("hasClaimedToday in DailyStreakCard:", claimedToday);
  const streak = userData?.daily_streak || 0;
  const currentDay = new Date().getDay();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-700">Daily Streak</h3>
      </div>

      <div className="text-5xl font-bold text-purple-600 mb-4">
        {streak} day{streak !== 1 ? "s" : ""}
      </div>

      <div className="flex gap-2 mb-4">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
              i === currentDay
                ? "bg-purple-600 text-white ring-2 ring-purple-300 scale-110"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600 mb-3">
        Check in daily to earn +5 points
      </p>

      <button
        onClick={onClaimPoints}
         disabled={isClaiming || claimedToday}
        className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${claimedToday ? 'claimed' : ''}`}
        // className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Zap className="w-5 h-5" />
          {claimedToday 
         ? 'Already Claimed' 
         : isClaiming 
         ? 'Claiming...' 
         : 'Claim Points (+5)'
      }
      </button>
    </div>
  );
};

export default DailyStreakCard;