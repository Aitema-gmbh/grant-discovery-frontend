# Grant Discovery Platform - Frontend

Vue 3 + TypeScript frontend for the Grant Discovery Platform with Supabase authentication.

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Authentication**: Supabase Auth
- **API Client**: Axios
- **Deployment**: Cloudflare Pages

## Project Structure

```
grant-discovery-frontend/
├── src/
│   ├── lib/
│   │   └── supabase.ts            # Supabase client configuration
│   ├── services/
│   │   └── api.ts                 # API service with Axios
│   ├── stores/
│   │   └── auth.ts                # Authentication store (Pinia)
│   ├── router/
│   │   └── index.ts               # Vue Router configuration
│   ├── views/
│   │   ├── auth/
│   │   │   ├── LoginPage.vue      # Email/password + Google OAuth login
│   │   │   ├── RegisterPage.vue   # User registration
│   │   │   └── CallbackPage.vue   # OAuth callback handler
│   │   ├── DashboardPage.vue      # User dashboard
│   │   ├── GrantsPage.vue         # Public grant browsing
│   │   ├── CSOListPage.vue        # User's CSO profiles
│   │   ├── CSOCreatePage.vue      # Create CSO profile
│   │   ├── CSODetailPage.vue      # CSO profile details
│   │   ├── MatchesPage.vue        # Matched grants
│   │   └── NotFoundPage.vue       # 404 page
│   ├── App.vue                    # Root component
│   ├── main.ts                    # App entry point
│   └── style.css                  # Tailwind directives + custom styles
├── .env.development               # Development environment variables
├── .env.production                # Production environment variables
├── .env.example                   # Example environment file
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── package.json                   # Dependencies
```

## Setup

### Prerequisites

- Node.js 18+ installed
- Access to Supabase instance at https://supabase.aitema.de
- Supabase ANON_KEY (retrieve from server)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development

# Retrieve Supabase anon key from server
ssh root@49.13.15.44 "grep ANON_KEY /root/hetzner-stack/.env"

# Add the key to .env.development
# VITE_SUPABASE_ANON_KEY=<paste-key-here>
```

### Development

```bash
# Start dev server
npm run dev

# Dev server runs at: http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.development` and `.env.production` files:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://supabase.aitema.de
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# API Configuration
VITE_API_BASE_URL=http://localhost:8787  # Development
# VITE_API_BASE_URL=https://grant-discovery.dieter-meier82.workers.dev  # Production
```

## Deployment to Cloudflare Pages

### One-Time Setup

```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Deploy

```bash
# Build the app
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=grant-discovery-frontend --branch=main
```

### Set Environment Variables (Cloudflare Dashboard)

1. Go to Cloudflare Pages dashboard
2. Select your project: `grant-discovery-frontend`
3. Go to **Settings** → **Environment Variables**
4. Add production variables:
   - `VITE_SUPABASE_URL`: `https://supabase.aitema.de`
   - `VITE_SUPABASE_ANON_KEY`: (get from server)
   - `VITE_API_BASE_URL`: `https://grant-discovery.dieter-meier82.workers.dev`
5. Click **Save**

### Configure Custom Domain (Optional)

1. In Cloudflare Pages dashboard
2. Go to **Custom domains**
3. Add domain: `grants.dieter-meier82.pages.dev` (or custom domain)

## Authentication Flow

### Email/Password Login

1. User enters email and password
2. Supabase Auth validates credentials
3. JWT access token returned
4. Token stored in localStorage
5. Token auto-attached to API requests via Axios interceptor

### Google OAuth Login

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After consent, redirected to `/auth/callback`
4. Callback page extracts session from URL
5. User redirected to dashboard

### Token Management

- Access tokens stored in localStorage
- Auto-refresh before expiration (Supabase handles this)
- On 401 response from API, user logged out and redirected to login

## API Integration

The `api.ts` service provides pre-configured API endpoints:

```typescript
import { grantsApi, csoApi, matchingApi } from '@/services/api'

// Search grants
const { grants } = await grantsApi.search({ query: 'democracy' })

// Create CSO profile
const { cso } = await csoApi.create({ name: 'My NGO', ... })

// Find matching grants
const { matches } = await matchingApi.findGrants('cso-id')
```

All API calls automatically include the user's JWT token via Axios interceptor.

## Navigation Guards

Routes are protected based on authentication status:

- **Public routes**: `/`, `/grants`
- **Guest-only routes**: `/auth/login`, `/auth/register` (redirect to dashboard if logged in)
- **Protected routes**: `/dashboard`, `/cso/*`, `/matches` (redirect to login if not logged in)

## Tailwind CSS

Custom utility classes defined in `style.css`:

```vue
<template>
  <button class="btn btn-primary">Click me</button>
  <input class="input" />
  <div class="card">Content</div>
</template>
```

## Troubleshooting

### Supabase Connection Error

- Verify `VITE_SUPABASE_URL` is set correctly
- Check `VITE_SUPABASE_ANON_KEY` is valid
- Ensure Supabase instance is running: https://studio.aitema.de

### API Requests Failing with 401

- Check that user is logged in
- Verify JWT token in localStorage (Dev Tools → Application → Local Storage)
- Check API endpoint in `.env` file

### OAuth Redirect Not Working

1. Verify redirect URLs in Supabase Studio:
   - Go to https://studio.aitema.de
   - Authentication → URL Configuration
   - Add: `http://localhost:5173/auth/callback` (dev)
   - Add: `https://grants.dieter-meier82.pages.dev/auth/callback` (prod)

2. Check Google OAuth credentials in Supabase Studio:
   - Authentication → Providers → Google
   - Ensure Client ID and Secret are set

## Development Workflow

1. Start backend API: `cd "../UA 5" && npm run dev`
2. Start frontend dev server: `npm run dev`
3. Visit http://localhost:5173
4. Login or register to test authentication
5. Verify API requests in Network tab

## Next Steps

- [ ] Implement CSO profile creation form
- [ ] Add grant browsing with filters
- [ ] Build grant matching UI
- [ ] Add proposal creation workflow
- [ ] Implement dashboard analytics
- [ ] Add team collaboration features

## License

MIT
