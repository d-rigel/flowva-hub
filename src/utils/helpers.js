export const helpers = {
  formatNumber: (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  },

  truncateText: (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, message: "Copied to clipboard!" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  generateReferralLink: (userId) => {
    return `${window.location.origin}/ref/${userId}`;
  },

  calculateProgress: (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  },

  getInitials: (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  },

  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
getURL: () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return (
    import.meta.env.VITE_SITE_URL ?? 
    import.meta.env.VITE_VERCEL_URL ?? 
    'http://localhost:5173/'
  );
}

};