# Peptide Shot Tracker

A mobile-first web application for tracking peptide injections and maintaining medication adherence. Built with Next.js 14, Supabase, and a custom design system.

## Features

### Core Functionality
- **Magic Link Authentication** - Secure, passwordless authentication via email
- **Onboarding Flow** - Multi-step wizard for medication setup
- **Shot Logging** - Quick injection tracking with date/time, dosage, site selection, and notes
- **Calendar View** - Monthly calendar showing injection history with color-coded status
- **Analytics Dashboard** - Adherence tracking, statistics, and data visualization
- **Data Export** - CSV and HTML report generation for healthcare providers
- **Profile Management** - User profile and medication settings

### Technical Features
- Mobile-first responsive design optimized for iOS and Android
- Light and dark mode support with system preference detection
- HIPAA-compliant data handling with Row Level Security
- Real-time data synchronization
- Progressive Web App (PWA) support
- Optimized for performance with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with magic link
- **Styling**: Tailwind CSS 4 with custom design system
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Design System

This project uses the MM Design System featuring:
- **Primary Color**: MM Blue (#00A1FE)
- **Typography**: National2Condensed (headings), ESKlarheit (body)
- **Border Radius**: Signature 100px rounded buttons
- **Theme Support**: Full light/dark mode compatibility

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (database is pre-configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The environment variables are already configured in `.env.local`

3. The database schema is already set up with migrations applied

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Create a production build:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── calendar/           # Calendar view
│   │   ├── dashboard/          # Main dashboard
│   │   ├── settings/           # Settings page
│   │   └── stats/              # Analytics page
│   ├── auth/                   # Authentication pages
│   └── onboarding/             # Onboarding flow
├── components/                  # React components
│   ├── header.tsx              # App header
│   ├── mobile-nav.tsx          # Bottom navigation
│   └── log-shot-modal.tsx      # Injection logging modal
├── design-system/              # Design system assets
│   ├── lib/                    # Theme utilities
│   ├── styles/                 # Global styles
│   └── fonts/                  # Custom fonts
├── lib/                        # Utilities
│   └── supabase/              # Supabase client setup
├── types/                      # TypeScript definitions
└── public/                     # Static assets
```

## Database Schema

### Tables

- **profiles** - User profile information
- **medications** - Medication tracking (name, dosage, frequency)
- **injection_logs** - Injection history records
- **reminders** - Notification settings

All tables have Row Level Security (RLS) enabled for data privacy and HIPAA compliance.

## Key Features Implementation

### Authentication
Uses Supabase magic link authentication with automatic profile creation on first login.

### Onboarding
4-step wizard collecting:
1. User name
2. Medication details
3. Dosage and frequency
4. Preferred injection site

### Dashboard
- Next injection due date calculation
- Recent injection history
- Quick-log functionality with one-tap logging
- Medication overview cards

### Calendar
- Monthly view with color-coded injection markers
- Date selection to view detailed logs
- Navigation between months
- Completed injection indicators

### Statistics
- Adherence percentage calculation
- Monthly injection trends (bar chart)
- Injection site distribution (pie chart)
- Average days between injections
- Total injection counter

### Settings & Export
- Profile editing
- Medication management
- CSV export for spreadsheet analysis
- HTML report generation for healthcare providers
- Secure sign out

## Mobile Optimization

- Touch-friendly 44px minimum touch targets
- Bottom navigation for thumb-zone accessibility
- Optimized layouts for portrait orientation
- PWA manifest for "Add to Home Screen"
- Responsive breakpoints for tablet and desktop

## Security

- Row Level Security policies on all database tables
- Server-side authentication checks
- Secure session management with HTTP-only cookies
- Environment variable protection
- HIPAA-compliant data handling practices

## Performance

- Server-side rendering for initial page loads
- Code splitting and lazy loading
- Optimized bundle sizes
- Image optimization with Next.js Image component
- Efficient data fetching with Supabase queries

## Browser Support

- Chrome/Edge (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

## License

MIT

## Support

For issues or questions, please refer to the design system documentation in `design-system/README.md` and coding guidelines in `design-system/AI-CODING-RULES.md`.
