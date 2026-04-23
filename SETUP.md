# SocialVIP — Setup Guide

## 1. Install dependencies
Open Terminal, navigate to this folder, then run:
```bash
npm install
```

## 2. Set up environment variables
Copy the example file and fill in your keys:
```bash
cp .env.local.example .env.local
```

You need:
- **Supabase URL & anon key** — from Supabase → Project Settings → API
- **Supabase service role key** — same page (keep this secret!)
- **Stripe publishable & secret keys** — from https://dashboard.stripe.com/apikeys
- **Stripe webhook secret** — set up after deploying (see step 5)

## 3. Set up the database
1. Go to your Supabase project
2. Open **SQL Editor**
3. Paste the entire contents of `supabase-schema.sql` and click **Run**

## 4. Make yourself an admin
After signing up in the app, run this in the Supabase SQL Editor:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'jlasarow@gmail.com';
```

## 5. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: SocialVIP members club booking app"
git remote add origin https://github.com/jlasarow/socialvip.git
git push -u origin main
```

## 6. Deploy to Vercel
1. Go to vercel.com and click **Add New Project**
2. Import the `jlasarow/socialvip` GitHub repo
3. Add all environment variables from `.env.local`
4. Deploy!

## 7. Set up Stripe webhook
After deploying, go to https://dashboard.stripe.com/webhooks and:
1. Add endpoint: `https://your-vercel-url.vercel.app/api/stripe/webhook`
2. Select events: `checkout.session.completed`, `checkout.session.expired`
3. Copy the webhook signing secret into your Vercel env vars as `STRIPE_WEBHOOK_SECRET`

## 8. Run locally
```bash
npm run dev
```
Open http://localhost:3000
