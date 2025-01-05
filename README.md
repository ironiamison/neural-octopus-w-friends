# Papermemes.fun Trading Platform

A modern crypto trading platform powered by AI16Z™ Advanced Market Intelligence.

## Features

- Real-time market data and trading
- AI-powered news analysis and market insights
- Portfolio management and tracking
- Secure wallet integration
- Interactive trading charts
- Performance analytics
- Social trading features

## Tech Stack

- Next.js 14
- TypeScript
- Prisma
- MongoDB
- TailwindCSS
- Framer Motion

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/neural-octopus.git
cd neural-octopus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
DATABASE_URL="your_mongodb_url"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically deploy your changes.

Make sure to configure the following environment variables in your Vercel project settings:
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
