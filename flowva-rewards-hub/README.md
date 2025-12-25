# Flowva Rewards Hub 🎁

A modern rewards and points management system built with React and Supabase. Users can earn points through daily check-ins, maintain streaks, and redeem rewards.

![Flowva Logo](https://img.shields.io/badge/Flowva-Rewards%20Hub-8B5CF6?style=for-the-badge&logo=react)

## ✨ Features

### 🎯 Core Functionality

- **Daily Check-ins**: Earn 5 points every day by claiming your daily reward
- **Streak System**: Build consecutive day streaks for consistent engagement
- **Points Balance**: Track your total points and progress toward rewards
- **Rewards Catalog**: Browse and redeem various gift cards and rewards
- **Referral System**: Invite friends and earn bonus points
- **Real-time Updates**: All data synced with Supabase in real-time

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Tab Navigation**: Easy switching between "Earn Points" and "Redeem Rewards"
- **Status Indicators**: Visual feedback for locked/unlocked rewards
- **Progress Tracking**: Visual progress bars showing distance to next reward

## 🛠️ Tech Stack

### Frontend

- **React** (v18+) - UI framework
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React Hooks** - State management

### Backend

- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/flowva-rewards-hub.git
cd flowva-rewards-hub
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Database Setup

#### Create the following tables in your Supabase project:

**1. Users Table** (if not using Supabase Auth default)

```sql
-- This may already exist if using Supabase Auth
-- Just ensure it has the necessary fields
```

**2. User Data Table**

```sql
create table public.user_data (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer default 0,
  daily_streak integer default 0,
  last_claim_date text null,
  points_earned integer default 0,
  referrals integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint user_data_pkey primary key (id),
  constraint user_data_user_id_key unique (user_id)
);
```

**3. Rewards Table**

```sql
create table public.rewards (
  id uuid not null default extensions.uuid_generate_v4(),
  name text not null,
  description text null,
  points_required integer not null,
  icon text null,
  status text null default 'locked'::text,
  category text null,
  created_at timestamp with time zone null default now(),
  constraint rewards_pkey primary key (id)
);
```

**4. Insert Sample Rewards**

```sql
insert into public.rewards (name, description, points_required, icon, status, category) values
('$5 Bank Transfer', 'The $5 equivalent will be transferred to your bank account.', 5000, '💰', 'locked', 'cash'),
('$5 PayPal International', 'Receive a $5 PayPal balance transfer directly to your PayPal account email.', 5000, '💰', 'locked', 'cash'),
('$5 Virtual Visa Card', 'Use your $5 prepaid card to shop anywhere Visa is accepted online.', 5000, '🎁', 'locked', 'gift-card'),
('$5 Apple Gift Card', 'Redeem this $5 Apple Gift Card for apps, games, music, movies, and more.', 5000, '🎁', 'locked', 'gift-card'),
('$5 Google Play Card', 'Use this $5 Google Play Gift Card to purchase apps, games, movies, and books.', 5000, '🎁', 'locked', 'gift-card'),
('$5 Amazon Gift Card', 'Get a $5 digital gift card to spend on your favorite products.', 5000, '🎁', 'locked', 'gift-card'),
('$10 Amazon Gift Card', 'Get a $10 digital gift card to spend on your favorite products.', 10000, '🎁', 'locked', 'gift-card'),
('Free Udemy Course', 'Coming Soon!', 0, '📚', 'coming-soon', 'education');
```

**5. Enable Row Level Security (RLS)**

```sql
-- Enable RLS on user_data table
alter table public.user_data enable row level security;

-- Policy: Users can read their own data
create policy "Users can view own user_data"
  on public.user_data for select
  using (auth.uid() = user_id);

-- Policy: Users can update their own data
create policy "Users can update own user_data"
  on public.user_data for update
  using (auth.uid() = user_id);

-- Policy: Users can insert their own data
create policy "Users can insert own user_data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

-- Enable RLS on rewards table
alter table public.rewards enable row level security;

-- Policy: Anyone can read rewards
create policy "Anyone can view rewards"
  on public.rewards for select
  using (true);
```

### Step 5: Run the Application

```bash
npm start
# or
yarn start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
flowva-rewards-hub/
├── public/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx          # Main dashboard container
│   │   │   ├── Header.jsx             # Dashboard header with notifications
│   │   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   │   └── NavItem.jsx            # Reusable navigation item
│   │   └── rewards/
│   │       ├── EarnPointsTab.jsx      # Earn points view
│   │       ├── RedeemRewardsTab.jsx   # Rewards catalog view
│   │       ├── PointsBalanceCard.jsx  # Points balance display
│   │       ├── DailyStreakCard.jsx    # Daily check-in card
│   │       ├── TopToolSpotlight.jsx   # Featured tool promotion
│   │       ├── RewardCard.jsx         # Individual reward card
│   │       └── ClaimPointsModal.jsx   # Success modal for claims
│   ├── services/
│   │   ├── supabase.js                # Supabase client configuration
│   │   ├── userService.js             # User data operations
│   │   └── rewardsService.js          # Rewards operations
│   ├── utils/
│   │   └── dateUtils.js               # Date formatting utilities
│   ├── App.jsx                        # Root component
│   └── index.js                       # Entry point
├── .env                               # Environment variables
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎮 Usage

### For Users

1. **Sign In/Sign Up**: Authenticate using your email
2. **Claim Daily Points**: Click "Claim Points" button to earn 5 points daily
3. **Build Streaks**: Check in consecutive days to build your streak
4. **Browse Rewards**: Navigate to "Redeem Rewards" tab
5. **Filter Rewards**: Use tabs to filter (All, Unlocked, Locked, Coming Soon)
6. **Redeem**: Click "Redeem" on unlocked rewards to claim them
7. **Refer Friends**: Share your referral link to earn bonus points

### For Developers

#### Adding New Rewards

```javascript
// Insert via Supabase SQL Editor
insert into public.rewards (name, description, points_required, icon, status)
values ('New Reward', 'Description here', 1000, '🎉', 'locked');
```

#### Updating Point Values

```javascript
// In userService.js or directly in component
const updates = {
  points: currentPoints + pointsToAdd,
  // ... other fields
};
await userService.updateUserData(userId, updates);
```

## 🔐 Security

- **Row Level Security**: All database tables use RLS policies
- **Authentication**: Supabase Auth handles user sessions
- **Environment Variables**: Sensitive keys stored in `.env`
- **User Isolation**: Users can only access their own data

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag `build` folder to Netlify
3. Configure environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility classes
- Lucide for beautiful icons
- Supabase for the backend infrastructure
- React community for continuous inspiration

# Author

**Emmanuel Alozie**
