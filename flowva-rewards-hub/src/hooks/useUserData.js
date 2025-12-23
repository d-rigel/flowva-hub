import { useState, useEffect } from "react";
import { userService } from "../services/userService";

export const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      const { data, error } = await userService.getUserData(userId);

      if (error) {
        setError(error.message);
      } else {
        setUserData(data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const refreshUserData = async () => {
    if (!userId) return;

    const { data, error } = await userService.getUserData(userId);
    if (!error) {
      setUserData(data);
    }
  };

  return {
    userData,
    setUserData,
    loading,
    error,
    refreshUserData,
  };
};