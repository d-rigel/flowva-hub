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

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**
- **Supabase account** (free tier available at [supabase.com](https://supabase.com))

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/flowva-rewards-hub.git
cd flowva-rewards-hub
```

### Step 2: Install Dependencies

This project uses **Vite** as the build tool and **Tailwind CSS v4** for styling.

```bash
npm install
# or
yarn install
# or
pnpm install
```

**Dependencies Overview:**

- `react@19.2.0` - UI framework
- `@supabase/supabase-js@2.89.0` - Supabase client
- `lucide-react@0.562.0` - Icon library
- `tailwindcss@4.1.18` - Styling framework
- `vite@7.2.4` - Build tool and dev server

### Step 3: Supabase Setup

#### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Project name: `flowva-rewards-hub`
   - Database password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project" and wait for setup to complete

#### 3.2 Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under Project URL section)
   - **anon/public key** (under Project API keys section)

### Step 4: Environment Setup

Create a `.env` file in the root directory:

```env
# Vite uses VITE_ prefix for environment variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example:**

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Important**: This project uses **Vite**, so environment variables must be prefixed with `VITE_` (not `REACT_APP_`)

### Step 5: Supabase Client Configuration

Update your Supabase client file to use Vite environment variables:

**`src/services/supabase.js`**

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will open at `http://localhost:5173` (Vite's default port)

#### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

#### Linting

```bash
npm run lint
```

### Step 8: Create Your First User

1. Open the app at `http://localhost:5173`
2. Navigate to the sign-up page
3. Create an account with your email
4. Check your email for verification (if enabled in Supabase)
5. Sign in and start earning points!

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

### Deploy to Vercel (Recommended)

Vercel works seamlessly with Vite projects.

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Vite configuration

3. **Configure Environment Variables**

   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - Apply to all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Deploy to Netlify

1. **Build the project locally**

   ```bash
   npm run build
   ```

   This creates a `dist` folder

2. **Deploy via Netlify CLI**

   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

   Select the `dist` folder when prompted

3. **Or Deploy via Netlify Dashboard**
   - Drag and drop the `dist` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
4. **Configure Environment Variables**

   - Go to **Site settings** → **Environment variables**
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Build Settings** (if connecting to Git)
   - Build command: `npm run build`
   - Publish directory: `dist`

### Deploy to GitHub Pages

1. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `vite.config.js`**

   ```javascript
   export default {
     base: "/flowva-rewards-hub/", // Replace with your repo name
   };
   ```

3. **Add deploy script to `package.json`**

   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Environment Variables for Production

Remember to set these in your deployment platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

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

- **Emmanuel Alozie**

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility classes
- Lucide for beautiful icons
- Supabase for the backend infrastructure
- React community for continuous inspiration
