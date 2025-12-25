
import React from "react";
import PointsBalanceCard from "./PointsBalanceCard";
import DailyStreakCard from "./DailyStreakCard";
import TopToolSpotlight from "./TopToolSpotlight";
import { Award, Share2, Users } from "lucide-react";



const EarnPointsTab = ({userData, onClaimPoints, canClaimToday, isClaiming }) => {
      
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
        Your Rewards Journey
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <PointsBalanceCard userData={userData} />
        <DailyStreakCard
        isClaiming={isClaiming}
          userData={userData}
          onClaimPoints={onClaimPoints}
          canClaimToday={canClaimToday}
        />
        <TopToolSpotlight />
      </div>

      {/* Earn More Points Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
        Earn More Points
      </h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">
              Refer and win 10,000 points!
            </h3>
            <p className="text-gray-600 mb-4">
              Invite 3 friends by Nov 20 and earn a chance to be one of 5
              winners of{" "}
              <span className="font-semibold text-purple-600">
                10,000 points
              </span>
              . Friends must complete onboarding to qualify.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Share2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">Share Your Stack</h3>
              <span className="text-sm font-semibold text-gray-600">
                Earn +25 pts
              </span>
            </div>
            <p className="text-gray-600 mb-4">Share your tool stack</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Refer & Earn Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
        Refer & Earn
      </h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Share Your Link</h3>
            <p className="text-gray-600 text-sm">
              Invite friends and earn 25 points when they join!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">
              {userData?.referrals || 0}
            </div>
            <p className="text-gray-600 text-sm">Referrals</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">
              {userData?.points_earned || 0}
            </div>
            <p className="text-gray-600 text-sm">Points Earned</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            Your personal referral link:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={`https://flowvahub.com/ref/${userData?.id}`}
              readOnly
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition duration-200"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://flowvahub.com/ref/${userData.id}`
                );
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EarnPointsTab