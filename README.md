# PaperMemes Trading Platform

A Next.js-based paper trading platform for cryptocurrency with AI-powered market analysis and gamification features.

## Features

- 📈 Real-time paper trading with market data
- 🤖 AI16Z-powered market analysis
- 👛 Phantom wallet integration
- 📊 Portfolio tracking and analytics
- 🎮 Gamification with XP and achievements
- 📰 Crypto news aggregation
- 📱 Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma with MongoDB
- TailwindCSS
- Framer Motion
- Phantom Wallet

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/papermemes.git
cd papermemes
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following:
```env
DATABASE_URL="your_mongodb_url"
OPENAI_API_KEY="your_openai_api_key"
NEWS_API_KEY="your_newsapi_key"
NEWSAPI_KEY="your_newsapi_org_key"
```

4. Initialize Prisma:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

## Deployment

The project is set up for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set up the environment variables in Vercel's dashboard
4. Deploy!

## Environment Variables

Required environment variables:

- `DATABASE_URL`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key for AI16Z analysis
- `NEWS_API_KEY`: NewsData.io API key
- `NEWSAPI_KEY`: NewsAPI.org API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
