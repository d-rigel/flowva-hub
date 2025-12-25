import React from "react";
import { Calendar, Users, Gift } from "lucide-react";

const TopToolSpotlight = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
        Featured
      </div>

      <h3 className="text-xl font-bold mb-2">Top Tool Spotlight</h3>
      <p className="text-2xl font-bold mb-3">Reclaim</p>

      <div className="flex items-start gap-3 mb-4">
        <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
        <p className="text-sm leading-relaxed">
          Automate and Optimize Your Schedule. Reclaim.ai is an AI-powered
          calendar assistant that automatically schedules your tasks, meetings,
          and breaks to boost productivity. Free to try — earn Flowva Points
          when you sign up!
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-2 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2">
          <Users className="w-2 h-2" />
          Sign up
        </button>
        <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-4 py-2 rounded-lg font-semibold transition duration-200 flex items-center gap-2 shadow-lg">
          <Gift className="w-4 h-4" />
          Claim 50 pts
        </button>
      </div>

      {/* Decorative circles */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
    </div>
  );
};

export default TopToolSpotlight;