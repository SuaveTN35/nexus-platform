# Getting Started with NEXUS Platform

Welcome to the NEXUS Platform! This guide will help you get up and running quickly.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- **Node.js** 20 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- Git (optional, for version control)

### Step 1: Install Dependencies

```bash
cd nexus-platform
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

**That's it!** You're ready to start developing.

---

## 📁 Project Structure

```
nexus-platform/
├── app/                    # Next.js App Router (pages & routes)
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── contacts/          # Contact management
│   ├── campaigns/         # Campaign management
│   ├── deals/             # Deal pipeline
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components (Button, Card, etc.)
│   └── layout/           # Layout components (Header, Sidebar, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## 📚 Key Documentation

- **[README.md](./README.md)** - Project overview
- **[QUICK-START.md](./QUICK-START.md)** - Quick start guide
- **[BUILD-SUMMARY.md](./BUILD-SUMMARY.md)** - Feature list
- **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - Progress tracking
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[PHASE-0-COMPLETE.md](./PHASE-0-COMPLETE.md)** - Phase 0 completion summary
- **[FEATURES.md](./FEATURES.md)** - Detailed features

---

## 🎯 What's Included

### ✅ Complete Foundation (Phase 0 - COMPLETE)

- **14 UI Components** - Button, Card, Input, Select, Modal, Table, Toast, etc.
- **12 Pages** - Dashboard, Contacts, Campaigns, Deals, Analytics, Settings, etc.
- **12 API Endpoints** - Full CRUD for Contacts, Campaigns, Deals
- **3 Custom Hooks** - useContacts, useDeals, useCampaigns
- **30+ Utility Functions** - Formatting, validation, helpers
- **Error Handling** - Error pages, error boundary, toast notifications
- **Search & Filter** - Search on all list pages
- **Type Safety** - 100% TypeScript coverage

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Currently, the platform uses mock data. Environment variables will be needed when integrating:
- Database connection
- Authentication secrets
- Third-party API keys

---

## 🎨 Using Components

### Basic Component Usage

```tsx
import { Button, Card, Input } from '@/components/ui';

function MyComponent() {
  return (
    <Card padding="lg">
      <Input label="Name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### Using Hooks

```tsx
import { useContacts } from '@/lib/hooks';

function ContactsList() {
  const { contacts, loading, error, createContact } = useContacts();
  // Use the data...
}
```

### Using Utilities

```tsx
import { formatCurrency, formatDate, debounce } from '@/lib/utils';

const formatted = formatCurrency(1000); // $1,000
const date = formatDate(new Date()); // Jan 20, 2025
```

---

## 📖 Next Steps

### For Development

1. **Explore the Codebase**
   - Check out `app/` for pages
   - Look at `components/ui/` for reusable components
   - Review `lib/` for utilities

2. **Read the Documentation**
   - Start with [QUICK-START.md](./QUICK-START.md)
   - Review [BUILD-SUMMARY.md](./BUILD-SUMMARY.md)

3. **Start Building**
   - All components are ready to use
   - API structure is in place
   - Types are defined

### For Phase 1 (Next Phase)

- Database integration (PostgreSQL)
- Authentication backend
- Real data connections
- Additional features

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
# Check TypeScript
npm run type-check
```

---

## 💡 Tips

- **Use TypeScript** - All types are defined, take advantage!
- **Follow Patterns** - Look at existing components for patterns
- **Check Documentation** - Most utilities have JSDoc comments
- **Use Components** - Don't reinvent, use existing UI components
- **Type Safety** - Let TypeScript guide you

---

## 🎉 You're All Set!

The NEXUS Platform foundation is complete and ready for development.

**Happy Coding!** 🚀

*For questions or issues, refer to the documentation or check the project status.*

