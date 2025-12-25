import { supabase } from "./supabase";
import { dateUtils } from "../utils/dateUtils";

export const pointsService = {
  // Check if user can claim today
  canClaimToday: async (userId) => {
    const { data, error } = await supabase
      .from("user_data")
      .select("last_claim_date")
      .eq("user_id", userId)
      .single();

    if (error) return { canClaim: false, error };

    const today = dateUtils.getTodayString();
    const canClaim = data.last_claim_date !== today;

    return { canClaim, lastClaimDate: data.last_claim_date };
  },

  // Claim daily points
  claimDailyPoints: async (userId, currentData) => {
    const today = dateUtils.getTodayString();
    const yesterday = dateUtils.getYesterdayString();

    // Calculate new streak
    const newStreak =
      currentData.last_claim_date === yesterday
        ? (currentData.daily_streak || 0) + 1
        : 1;

    // Update points
    const { data, error } = await supabase
      .from("user_data")
      .update({
        points: (currentData.points || 0) + 5,
        daily_streak: newStreak,
        last_claim_date: today,
        points_earned: (currentData.points_earned || 0) + 5,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    return { data, error };
  },

  // Add points (generic)
  addPoints: async (userId, points, reason = "manual") => {
    // Get current points
    const { data: userData, error: fetchError } = await supabase
      .from("user_data")
      .select("points, points_earned")
      .eq("user_id", userId)
      .single();

    if (fetchError) return { data: null, error: fetchError };

    // Update points
    const { data, error } = await supabase
      .from("user_data")
      .update({
        points: (userData.points || 0) + points,
        points_earned: (userData.points_earned || 0) + points,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    return { data, error };
  },
};