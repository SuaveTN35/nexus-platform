# Phase 1 - Database & Authentication: Preparation Guide

**Phase 0 Status:** ✅ Complete  
**Phase 1 Status:** 🚧 Ready to Begin  
**Next Steps:** Database & Authentication Integration

---

## 🎯 Phase 1 Goals

### Primary Objectives

1. **Database Integration**
   - PostgreSQL database setup
   - Database schema implementation
   - ORM integration (Prisma or Drizzle)
   - Migrations system
   - Connection pooling

2. **Authentication System**
   - User authentication backend
   - JWT token management
   - Session management
   - Protected routes
   - Role-based access control (RBAC)

3. **Real Data Integration**
   - Replace mock data with database queries
   - Update API endpoints to use database
   - Implement data validation
   - Add database transactions

4. **Additional Features**
   - User management
   - Organization management
   - File uploads (optional)
   - Real-time updates (optional)

---

## 📋 Prerequisites Checklist

Before starting Phase 1, ensure you have:

- [x] Phase 0 complete (✅ Done)
- [ ] PostgreSQL installed locally or access to database
- [ ] Database credentials/connection string
- [ ] Understanding of chosen ORM (Prisma or Drizzle)
- [ ] Environment variables configured
- [ ] Development environment ready

---

## 🛠️ Technology Stack for Phase 1

### Database
- **PostgreSQL** 14+ (recommended)
- **ORM Options:**
  - **Prisma** (recommended for ease of use)
  - **Drizzle** (lightweight, type-safe)
- **Migration Tool:** Prisma Migrate or Drizzle Kit

### Authentication
- **JWT:** `jsonwebtoken` or `jose`
- **Password Hashing:** `bcryptjs` or `argon2`
- **Session Management:** JWT tokens
- **Middleware:** Next.js middleware for route protection

### Additional Packages Needed
```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",  // If using Prisma
    "prisma": "^5.0.0",           // If using Prisma
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "zod": "^3.23.8",             // Already have this
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.0"
  }
}
```

---

## 📁 Phase 1 File Structure

```
aequalis-platform/
├── prisma/                    # If using Prisma
│   ├── schema.prisma
│   └── migrations/
├── lib/
│   ├── db/                    # Database utilities
│   │   ├── client.ts          # Database client
│   │   └── migrations.ts      # Migration helpers
│   ├── auth/                  # Authentication utilities
│   │   ├── jwt.ts             # JWT utilities
│   │   ├── password.ts        # Password hashing
│   │   └── session.ts         # Session management
│   └── middleware/            # Middleware utilities
├── app/
│   ├── api/
│   │   └── auth/              # Auth API routes
│   │       ├── login/
│   │       ├── register/
│   │       └── logout/
│   └── (protected)/           # Protected routes
└── middleware.ts              # Next.js middleware
```

---

## 🗄️ Database Schema Outline

### Core Tables

#### Users
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- passwordHash (String)
- firstName (String)
- lastName (String)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Organizations
```sql
- id (UUID, Primary Key)
- name (String)
- slug (String, Unique)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### OrganizationMembers
```sql
- id (UUID, Primary Key)
- userId (UUID, Foreign Key -> Users)
- organizationId (UUID, Foreign Key -> Organizations)
- role (Enum: owner, admin, member)
- createdAt (DateTime)
```

#### Contacts
```sql
- id (UUID, Primary Key)
- organizationId (UUID, Foreign Key -> Organizations)
- firstName (String)
- lastName (String)
- email (String, Nullable)
- phone (String, Nullable)
- company (String, Nullable)
- tags (JSON)
- customFields (JSON)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Campaigns
```sql
- id (UUID, Primary Key)
- organizationId (UUID, Foreign Key -> Organizations)
- name (String)
- type (Enum: email, sms, multi-channel)
- status (Enum: draft, scheduled, active, paused, completed)
- startDate (DateTime, Nullable)
- endDate (DateTime, Nullable)
- settings (JSON)
- createdAt (DateTime)
- updatedAt (DateTime)
```

#### Deals
```sql
- id (UUID, Primary Key)
- organizationId (UUID, Foreign Key -> Organizations)
- contactId (UUID, Foreign Key -> Contacts)
- name (String)
- value (Decimal)
- stage (String)
- probability (Integer)
- status (Enum: open, won, lost)
- expectedCloseDate (DateTime, Nullable)
- actualCloseDate (DateTime, Nullable)
- createdAt (DateTime)
- updatedAt (DateTime)
```

---

## 🔐 Authentication Flow

### Registration Flow
1. User submits registration form
2. Validate input (email, password strength)
3. Hash password with bcrypt
4. Create user record in database
5. Create default organization
6. Create organization member record
7. Generate JWT token
8. Return token to client

### Login Flow
1. User submits login form
2. Find user by email
3. Verify password hash
4. Generate JWT token
5. Set token in HTTP-only cookie or return in response
6. Redirect to dashboard

### Protected Routes
1. Check for JWT token in request
2. Verify token signature
3. Extract user/organization info
4. Check permissions if needed
5. Allow/deny access

---

## 📝 Implementation Steps

### Step 1: Database Setup
1. Install PostgreSQL (if not already installed)
2. Create database
3. Choose ORM (Prisma recommended)
4. Install ORM packages
5. Create schema file
6. Run initial migration

### Step 2: Authentication Setup
1. Install authentication packages
2. Create authentication utilities (JWT, password hashing)
3. Create auth API routes (login, register, logout)
4. Implement middleware for route protection
5. Update login page to connect to API

### Step 3: Data Integration
1. Update API routes to use database
2. Replace mock data with database queries
3. Implement data validation
4. Add error handling
5. Update types to match database schema

### Step 4: User Management
1. Create user management pages
2. Implement user CRUD operations
3. Add organization management
4. Implement role-based access control

### Step 5: Testing & Polish
1. Test authentication flows
2. Test database operations
3. Test protected routes
4. Performance testing
5. Security audit

---

## 🔒 Security Considerations

### Authentication Security
- Use strong password hashing (bcrypt with salt rounds ≥ 10)
- Implement password strength requirements
- Use HTTPS in production
- Set secure cookie flags (HttpOnly, Secure, SameSite)
- Implement token expiration and refresh
- Rate limiting on auth endpoints

### Database Security
- Use parameterized queries (ORM handles this)
- Validate all inputs
- Implement proper error handling (don't leak info)
- Use connection pooling
- Regular backups
- Environment variables for credentials

---

## 📚 Resources

### Documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [Drizzle Docs](https://orm.drizzle.team/)
- [Next.js Auth](https://nextjs.org/docs/app/building-your-application/authentication)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

### Tutorials
- Prisma with Next.js
- JWT authentication in Next.js
- PostgreSQL setup
- Database migrations

---

## 🎯 Success Criteria

Phase 1 will be considered complete when:

- [ ] Database is set up and connected
- [ ] All tables are created with migrations
- [ ] User authentication is working (register, login, logout)
- [ ] Protected routes are implemented
- [ ] All API endpoints use real database
- [ ] Mock data is replaced with database queries
- [ ] User management is functional
- [ ] Organization management is functional
- [ ] All existing pages work with real data
- [ ] Security best practices are implemented
- [ ] Error handling is comprehensive
- [ ] Documentation is updated

---

## 🚀 Quick Start (When Ready)

1. **Install Dependencies**
   ```bash
   npm install @prisma/client prisma bcryptjs jsonwebtoken
   npm install -D @types/bcryptjs @types/jsonwebtoken
   ```

2. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

3. **Create Schema**
   - Edit `prisma/schema.prisma`
   - Define models based on schema outline

4. **Run Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Client**
   ```bash
   npx prisma generate
   ```

6. **Start Building!**
   - Create authentication utilities
   - Create auth API routes
   - Update existing endpoints
   - Test everything!

---

## 📝 Notes

- Start with authentication, then database integration
- Keep existing mock data as fallback during development
- Test thoroughly before removing mock data
- Document any schema changes
- Keep migrations in version control
- Use environment variables for all secrets

---

**Ready to begin Phase 1 when you are!** 🚀

*This guide will be updated as Phase 1 progresses.*

