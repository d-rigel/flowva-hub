export const POINTS = {
  DAILY_CLAIM: 5,
  REFERRAL: 25,
  SHARE_STACK: 25,
  REWARD_THRESHOLD: 5000,
  SIGNUP_BONUS: 0,
};

export const STREAK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const REWARD_STATUS = {
  LOCKED: "locked",
  UNLOCKED: "unlocked",
  COMING_SOON: "coming-soon",
};

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  VERIFICATION_EXPIRED: "/verification-expired",
};

export const ERROR_MESSAGES = {
  WEAK_PASSWORD:
    "Password is known to be weak and easy to guess, please choose a different one.",
  PASSWORD_MISMATCH: "Passwords do not match",
  INVALID_EMAIL: "Please enter a valid email address",
  REQUIRED_FIELD: "This field is required",
  MIN_PASSWORD_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter",
  PASSWORD_NUMBER: "Password must contain at least one number",
};

export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: "Verification email sent. Please check your inbox.",
  PASSWORD_RESET_SENT: "Password reset link sent! Please check your email.",
  PASSWORD_RESET_SUCCESS: "Password reset successful! Redirecting to login...",
  POINTS_CLAIMED:
    "You've claimed your daily points! Come back tomorrow for more!",
};