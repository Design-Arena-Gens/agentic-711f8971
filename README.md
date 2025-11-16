# Travel Expense Tracker

A modern travel expense tracking app optimized for India trips, built with Next.js, Firebase, and Tailwind CSS.

## Features

- **Trip Management**: Create and manage multiple trips with destinations, dates, and budgets
- **Expense Tracking**: Add expenses with amount, category, date/time, location (GPS), notes, and receipt images
- **Categories**: Food, Drinks, Shopping, Experience, Counter, Travel, Local Commute
- **Trip Dashboard**: View total spending, category breakdown, and daily expenses
- **Map View**: Visualize expense locations on an interactive map
- **Analytics**: Charts showing spending by category and daily trends
- **Budget Alerts**: Get notified when approaching or exceeding budget
- **Expense Reminders**: Periodic notifications to log expenses
- **Offline Mode**: Firebase offline persistence for working without internet
- **Secure**: Firebase security rules for personal data protection

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Enable **Storage**
6. Copy your Firebase configuration

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Security Rules

Deploy the security rules to Firebase:

**Firestore Rules** (`firestore.rules`):
- Go to Firestore Database > Rules
- Copy and paste the contents of `firestore.rules`
- Publish the rules

**Storage Rules** (`storage.rules`):
- Go to Storage > Rules
- Copy and paste the contents of `storage.rules`
- Publish the rules

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Deployment

This app is configured for Vercel deployment:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-711f8971
```

After deployment, access the app at: https://agentic-711f8971.vercel.app

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **Maps**: Leaflet + OpenStreetMap
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── trip/[id]/        # Trip detail page
│   └── page.tsx          # Auth page
├── components/            # React components
├── contexts/             # React contexts (Auth)
├── hooks/                # Custom hooks
├── lib/                  # Utilities and Firebase config
└── public/              # Static assets
```

## Usage

1. **Sign Up/Sign In**: Create an account or sign in
2. **Create Trip**: Add a new trip with destination and dates
3. **Add Expenses**: Click "Add Expense" to log spending
4. **View Analytics**: Switch between List, Map, and Analytics views
5. **Track Budget**: Monitor spending against your trip budget

## License

MIT
