import { supabase } from "./supabase";

export const rewardsService = {
  // Get all rewards
  getAllRewards: async () => {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .order("points_required", { ascending: true });
    return { data, error };
  },

  // Get rewards by status
  getRewardsByStatus: async (status) => {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("status", status)
      .order("points_required", { ascending: true });
    return { data, error };
  },

  // Redeem reward
  redeemReward: async (userId, rewardId, userPoints) => {
    // Get reward details
    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .select("*")
      .eq("id", rewardId)
      .single();

    if (rewardError) return { data: null, error: rewardError };

    // Check if user has enough points
    if (userPoints < reward.points_required) {
      return {
        data: null,
        error: { message: "Insufficient points" },
      };
    }

    // Deduct points
    const { data, error } = await supabase
      .from("user_data")
      .update({
        points: userPoints - reward.points_required,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) return { data: null, error };

    // Log redemption (optional - requires redemptions table)
    // await supabase.from('redemptions').insert({
    //   user_id: userId,
    //   reward_id: rewardId,
    //   points_spent: reward.points_required
    // });

    return { data, error: null, reward };
  },
};