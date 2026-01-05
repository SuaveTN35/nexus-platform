# Preview the NEXUS Platform

**Quick guide to preview the platform locally**

---

## 🚀 Quick Preview (3 Steps)

### Step 1: Install Dependencies

```bash
cd "/Users/suavetn/Claude Repo Master/nexus-platform"
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Open in Browser

**Preview Link:** [http://localhost:3000](http://localhost:3000)

---

## 📱 Pages to Preview

Once the server is running, you can visit:

- **Homepage:** http://localhost:3000/
- **Dashboard:** http://localhost:3000/dashboard
- **Contacts:** http://localhost:3000/contacts
- **Campaigns:** http://localhost:3000/campaigns
- **Deals:** http://localhost:3000/deals
- **Analytics:** http://localhost:3000/analytics
- **Settings:** http://localhost:3000/settings
- **Login:** http://localhost:3000/auth/login

---

## 🎨 What You'll See

### Homepage Features
- Hero section with NEXUS Platform branding
- Feature cards (AI-Native, Predictive Intelligence, etc.)
- Call-to-action buttons
- Professional navy/gold color scheme

### Dashboard
- Statistics cards
- Recent activity feed
- Quick action buttons
- Overview of business metrics

### Contacts Page
- Search functionality
- Contact table
- Add contact modal
- Click contacts to view details

### Campaigns Page
- Campaign list with filtering
- Status badges
- Statistics cards

### Deals Page
- Kanban-style pipeline view
- Deal cards organized by stage
- Pipeline statistics

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installed
```bash
npm install
```

### Module Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**Once running, the preview link is:** http://localhost:3000

