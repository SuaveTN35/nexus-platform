# NEXUS Platform - Deployment Guide

**Version:** 1.0  
**Last Updated:** January 20, 2025

---

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended hosting platform for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables from `.env.example`
   - Redeploy after adding variables

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

### Option 2: Docker Deployment

#### Build Docker Image

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Build and Run

```bash
# Build image
docker build -t nexus-platform .

# Run container
docker run -p 3000:3000 --env-file .env nexus-platform
```

---

### Option 3: Self-Hosted (Node.js)

#### Requirements

- Node.js 20+
- PostgreSQL (for production database)
- Redis (optional, for caching)

#### Steps:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Use process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "nexus-platform" -- start
   pm2 save
   pm2 startup
   ```

---

## Environment Variables

See `.env.example` for all required environment variables.

### Required for Production

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXT_PUBLIC_APP_URL` - Your application URL

### Optional

- `SENDGRID_API_KEY` - For email sending
- `TWILIO_ACCOUNT_SID` - For SMS
- `OPENAI_API_KEY` - For AI features
- AWS credentials for file storage

---

## Database Setup

### PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu
   sudo apt-get install postgresql
   sudo systemctl start postgresql
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE nexus_platform;
   CREATE USER nexus_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE nexus_platform TO nexus_user;
   ```

3. **Run Migrations** (when migrations are set up)
   ```bash
   npm run migrate
   ```

---

## Performance Optimization

### Next.js Configuration

The platform is already optimized with:
- Automatic code splitting
- Image optimization
- Font optimization
- Static page generation where possible

### Recommended Settings

1. **Enable Compression**
   - Vercel: Automatic
   - Self-hosted: Use nginx or similar

2. **CDN Configuration**
   - Vercel: Automatic Edge Network
   - Self-hosted: Use Cloudflare or similar

3. **Caching Strategy**
   - Static assets: Long cache
   - API routes: Appropriate cache headers
   - Database queries: Use connection pooling

---

## Security Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on API routes
- [ ] Set up database backups
- [ ] Enable security headers
- [ ] Regular dependency updates
- [ ] Set up monitoring and logging

---

## Monitoring

### Recommended Services

- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Error Tracking:** Sentry
- **Analytics:** Vercel Analytics, Google Analytics
- **Logging:** Vercel Logs, Papertrail

### Health Check Endpoint

Create `/api/health` endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
```

---

## Troubleshooting

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 20+)

### Runtime Errors

- Check environment variables
- Verify database connection
- Check logs for specific errors
- Ensure all dependencies are installed

### Performance Issues

- Enable Next.js production mode
- Check database query performance
- Enable caching
- Optimize images and assets

---

## Next Steps

After deployment:

1. Set up database migrations
2. Configure authentication
3. Set up email/SMS services
4. Configure file storage
5. Set up monitoring
6. Configure backups
7. Set up CI/CD pipeline

---

*For additional support, refer to the main documentation or create an issue.*

