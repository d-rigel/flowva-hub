import { supabase } from "./supabase";

export const userService = {
  // Get user data
  getUserData: async (userId) => {
    const { data, error } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  },

  // Update user data
  updateUserData: async (userId, updates) => {
    const { data, error } = await supabase
      .from("user_data")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();
    return { data, error };
  },

  // Create user data (called automatically by trigger in production)
  createUserData: async (userId, initialData = {}) => {
    const { data, error } = await supabase
      .from("user_data")
      .insert({
        user_id: userId,
        first_name: initialData.first_name || "",
        points: 0,
        daily_streak: 0,
        referrals: 0,
        points_earned: 0,
        ...initialData,
      })
      .select()
      .single();
    return { data, error };
  },

  // Get user with referrals
  getUserWithReferrals: async (userId) => {
    const { data, error } = await supabase
      .from("user_data")
      .select(
        `
        *,
        referrals:referrals(count)
      `
      )
      .eq("user_id", userId)
      .single();
    return { data, error };
  },
};