# Setup Guide

This guide will help you set up papermemes.fun locally for development or deployment.

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git
- A modern web browser
- Text editor (VS Code recommended)

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/papermemes.fun.git
cd papermemes.fun
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/papermemes
REDIS_URL=redis://localhost:6379
AI_API_KEY=your_api_key
```

## Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
papermemes.fun/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   └── styles/           # CSS styles
├── public/               # Static assets
├── prisma/              # Database schema and migrations
├── scripts/             # Utility scripts
└── tests/               # Test files
```

## Key Components

### Frontend
- Next.js 13+ (App Router)
- TailwindCSS for styling
- ShadcnUI components
- React Query for data fetching
- Zustand for state management

### Backend
- Next.js API routes
- Prisma ORM
- PostgreSQL database
- Redis for caching
- WebSocket for real-time updates

### AI Integration
- OpenAI API for trading assistance
- Custom ML models for market analysis
- Stable Diffusion for meme generation

## Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow ESLint configuration
   - Use Prettier for formatting

2. **Git Workflow**
   - Create feature branches from `main`
   - Use conventional commits
   - Submit PRs for review

3. **Testing**
   - Write unit tests with Jest
   - Use React Testing Library
   - Run E2E tests with Cypress

4. **Performance**
   - Optimize images and assets
   - Use proper caching strategies
   - Implement lazy loading

## Common Issues

### Port Already in Use
```bash
kill -9 $(lsof -t -i:3000)
```

### Database Connection
Ensure PostgreSQL is running:
```bash
sudo service postgresql start
```

### Redis Connection
Verify Redis server status:
```bash
redis-cli ping
```

## Deployment

1. **Vercel Deployment**
   - Connect GitHub repository
   - Configure environment variables
   - Deploy automatically on push

2. **Manual Deployment**
   - Build the application
   - Set up reverse proxy
   - Configure SSL certificates

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Support

For technical issues:
1. Check the troubleshooting guide
2. Search existing GitHub issues
3. Create a new issue if needed
4. Contact the development team

Remember to keep your dependencies updated and regularly check for security advisories. 