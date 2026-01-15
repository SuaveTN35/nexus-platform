# AEQUALIS Platform - Quick Start Guide

**Welcome to AEQUALIS Platform!** This guide will get you up and running quickly.

---

## 🚀 Installation

### Prerequisites

- **Node.js** 20 or higher
- **npm** or **yarn**
- Git (optional, for version control)

### Step 1: Install Dependencies

```bash
cd aequalis-platform
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure Overview

```
aequalis-platform/
├── app/              # Next.js pages and routes
│   ├── api/         # API endpoints
│   ├── contacts/    # Contact pages
│   ├── campaigns/   # Campaign pages
│   ├── deals/       # Deal pages
│   └── ...
├── components/      # React components
│   ├── ui/         # UI components
│   └── layout/     # Layout components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
└── types/          # TypeScript definitions
```

---

## 🎯 Key Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/dashboard` | Main dashboard |
| `/contacts` | Contact list |
| `/contacts/[id]` | Contact detail |
| `/campaigns` | Campaign list |
| `/campaigns/[id]` | Campaign detail |
| `/deals` | Deal pipeline |
| `/deals/[id]` | Deal detail |
| `/analytics` | Analytics dashboard |
| `/settings` | Settings page |
| `/auth/login` | Login page |

---

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📚 Key Features

### Currently Implemented

- ✅ Complete UI component library
- ✅ Full page structure (10 pages)
- ✅ API routes (REST endpoints)
- ✅ Type-safe codebase (TypeScript)
- ✅ Custom React hooks
- ✅ Form validation
- ✅ Error handling
- ✅ Toast notifications

### Using Components

```tsx
import { Button, Card, Input, Modal } from '@/components/ui';

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
  
  // Use the data
}
```

### Using API Client

```tsx
import { contactsApi } from '@/lib/api-client';

// Fetch contacts
const response = await contactsApi.getAll();

// Create contact
const newContact = await contactsApi.create({ firstName: 'John', lastName: 'Doe' });
```

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Key Configuration Files

- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `package.json` - Dependencies and scripts

---

## 📖 Documentation

- **[README.md](./README.md)** - Project overview
- **[BUILD-SUMMARY.md](./BUILD-SUMMARY.md)** - Feature list and status
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - Progress tracking
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[Platform Vision](../platform-vision-strategy.md)** - Strategic vision
- **[Technical Architecture](../platform-technical-architecture.md)** - Technical specs

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Type errors:**
```bash
# Check TypeScript
npm run type-check
```

---

## 🎨 Design System

### Colors

- **Primary:** Navy blue (#102a43)
- **Accent:** Gold (#ffc240)
- **Status:** Green (success), Red (error), Yellow (warning), Blue (info)

### Typography

- **Display:** Playfair Display
- **Body:** Inter
- **Mono:** Monaco

---

## 🔗 Useful Links

- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org

---

## 📝 Next Steps

1. ✅ **Foundation Complete** - You're here!
2. ⏭️ **Database Integration** - Connect to PostgreSQL
3. ⏭️ **Authentication** - Implement user auth
4. ⏭️ **Real Data** - Replace mock data
5. ⏭️ **AI Features** - Add intelligence layer

---

**Happy Coding! 🚀**

*For questions or issues, refer to the documentation or check the project status.*

