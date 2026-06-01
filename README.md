# Next.js 16 Template

A production-ready, full-stack Next.js 16 template with TypeScript, Tailwind CSS, MongoDB, and a comprehensive admin panel. Perfect for building websites with content management capabilities without user authentication complexity.

## 🎯 Overview

This template provides a solid foundation for building modern web applications with:

- **Public Website** - Beautiful, SEO-optimized frontend
- **Admin Panel** - Full-featured content management system
- **No User Login Required** - Simplified authentication (admin-only)
- **Production Ready** - Error handling, logging, caching, and more

Perfect for portfolios, business websites, agencies, and any project needing content management without user accounts.

## ✨ Features

### Core Technologies

- **Next.js 16.0.1** - Latest App Router with React Server Components
- **React 19.2.0** - Latest React with improved performance
- **TypeScript** - Full type safety across the stack
- **Tailwind CSS v4** - Modern utility-first styling
- **MongoDB** - Flexible NoSQL database with Mongoose ODM
- **Redis** - High-performance caching and session storage
- **Cloudflare R2** - S3-compatible file storage (optional)

### Backend Features

- **RESTful API** - Well-structured API routes with Next.js App Router
- **Database Seeding** - Automatic initial data setup
- **Error Handling** - Comprehensive error middleware
- **Request Validation** - Zod schema validation
- **Authentication** - JWT-based admin authentication
- **File Uploads** - Presigned URL uploads to Cloudflare R2
- **Email System** - SMTP email sending with Nodemailer
- **Job Queues** - Background job processing with BullMQ
- **Logging** - Winston-based structured logging
- **Rate Limiting** - Built-in request throttling
- **CORS & Security** - Secure API configuration

### Frontend Features

- **Server Components** - Optimized rendering with RSC
- **Client Components** - Interactive UI where needed
- **State Management** - Zustand for global state
- **Form Handling** - Type-safe forms with Zod validation
- **UI Components** - shadcn/ui component library
- **Responsive Design** - Mobile-first approach
- **SEO Optimization** - Dynamic metadata and Open Graph
- **Error Boundaries** - Graceful error handling
- **Loading States** - Smooth UX transitions

### Admin Panel Features

- **Dashboard** - Overview with quick actions and statistics
- **Services Management** - Create, edit, and organize services
- **Projects Management** - Showcase portfolio projects
- **Testimonials** - Manage client feedback
- **Team Members** - Team page management
- **Brands** - Client/partner logo management
- **Site Settings** - Comprehensive settings including:
  - App details (name, logo, description)
  - Contact information
  - Social media links
  - SEO configuration
  - Branding (colors, fonts)
  - Email settings
  - Legal documents
  - Feature flags
  - Localization
  - Analytics integration

### Developer Experience

- **Type Safety** - End-to-end TypeScript
- **Code Formatting** - Prettier configuration
- **Linting** - ESLint with Next.js rules
- **Hot Reload** - Turbopack for fast development
- **Git Hooks** - Pre-commit validation (optional)

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **MongoDB** (local or Atlas)
- **Redis** (optional but recommended)
- **Cloudflare R2** (optional, for file uploads)
- **SMTP Email** credentials

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd next-16-template
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Application
APP_NAME=next-16-template
APP_URL=http://localhost:3000
NODE_ENV=development

# Internal styleguide (production only): /internal/styleguide?key=YOUR_SECRET
STYLEGUIDE_SECRET=

# Database (MongoDB)
DB_URL=mongodb://localhost:27017/your-database-name

# JWT Tokens (generate with: openssl rand -base64 32)
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
ACCESS_COOKIE_EXPIRES_IN=15
REFRESH_COOKIE_EXPIRES_IN=7

# Email (SMTP)
FROM_EMAIL=noreply@example.com
TO_EMAIL=recipient@example.com
MAIL_PASSWORD=your-email-password
MAIL_HOST=smtp.example.com
MAIL_PORT=587

# Redis
REDIS_URL=redis://localhost:6379
CACHE_EXPIRY=3600

# Cloudflare R2 (Optional)
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_CDN_URL=https://cdn.yourdomain.com
R2_PUBLIC_URL=https://your-bucket.r2.dev
R2_FOLDER_PREFIX=staging-files
```

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Access the Application

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/auth/login

### 5. Default Admin Credentials

After first run, the database is automatically seeded with:

- **Email**: `codegiyu@gmail.com` (customize in `app/_server/lib/seed/index.ts`)
- **Password**: `Password123`

⚠️ **Important**: Change these credentials immediately after first login!

## 📁 Project Structure

```
next-16-template/
├── app/                          # Next.js App Router
│   ├── _server/                  # Server-side code (not routes)
│   │   ├── controllers/          # Business logic
│   │   │   ├── auth/            # Authentication controllers
│   │   │   ├── services/        # Service management
│   │   │   ├── projects/        # Project management
│   │   │   ├── testimonials/    # Testimonial management
│   │   │   ├── team-members/    # Team management
│   │   │   ├── brands/          # Brand management
│   │   │   ├── site/            # Site settings
│   │   │   ├── upload/          # File upload handlers
│   │   │   └── webhooks/        # Webhook handlers
│   │   ├── lib/                  # Server utilities
│   │   │   ├── config/          # Configuration
│   │   │   ├── utils/           # Utility functions
│   │   │   ├── types/           # TypeScript types
│   │   │   ├── validation/      # Validation schemas
│   │   │   └── seed/            # Database seeding
│   │   ├── middlewares/         # Request middlewares
│   │   ├── models/              # Mongoose models
│   │   └── queues/              # Background jobs
│   ├── admin/                    # Admin panel routes
│   │   ├── auth/                # Admin authentication
│   │   └── dashboard/           # Admin dashboard pages
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin-only APIs
│   │   ├── auth/                # Authentication APIs
│   │   └── [public-apis]        # Public APIs
│   ├── [routes]/                # Public website routes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── error.tsx                # Error boundary
│   ├── not-found.tsx            # 404 page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── atoms/                   # Basic UI components
│   ├── forms/                   # Form components
│   ├── general/                 # General components
│   ├── layout/                  # Layout components
│   ├── section/                 # Page sections
│   │   ├── home/               # Home page sections
│   │   ├── admin/              # Admin panel sections
│   │   └── [other]/            # Other sections
│   └── ui/                      # shadcn/ui components
├── lib/                          # Shared utilities
│   ├── constants/               # Constants and configs
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API client
│   ├── store/                   # Zustand stores
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utility functions
├── public/                       # Static assets
│   ├── fonts/                   # Custom fonts
│   └── [assets]                 # Other assets
├── .env.local                   # Environment variables (create this)
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run checks` - Run lint, format check, and build

## 🎨 Admin Panel

### Dashboard Overview

The admin dashboard provides a central hub for managing your website:

- **Quick Actions** - Fast access to common tasks
- **Statistics** - Overview of content counts
- **Recent Activity** - Track recent changes

### Content Management

#### Services
Manage your service offerings:
- Create, edit, and delete services
- Upload service images
- Set display order
- Configure SEO per service

#### Projects
Showcase your portfolio:
- Add project details
- Upload multiple images
- Link to live projects
- Categorize projects
- Set featured projects

#### Testimonials
Manage client feedback:
- Add testimonials with ratings
- Link testimonials to projects
- Set featured testimonials
- Manage display order

#### Team Members
Build your team page:
- Add team member profiles
- Upload photos
- Set roles and descriptions
- Manage display order

#### Brands
Showcase clients/partners:
- Add brand logos
- Link to brand websites
- Set active/inactive status
- Manage display order

### Site Settings

Comprehensive settings panel with multiple tabs:

1. **App Details** - App name, logo, description
2. **Contact Info** - Address, phone, office hours
3. **Social Media** - All social platform links
4. **SEO** - Meta tags, Open Graph, structured data
5. **Branding** - Colors, fonts, visual identity
6. **Email** - Email configuration and templates
7. **Legal** - Privacy policy, terms, cookies
8. **Features** - Feature flags and toggles
9. **Localization** - Language and regional settings
10. **Analytics** - Tracking codes and analytics IDs

### Access Control

The template uses a role-based permission system:

- **Super Admin** - Full access to everything
- **Admin** - Limited permissions (configurable)
- Permissions are managed per-role in the database

## 🔐 Authentication

### How It Works

1. Admin logs in with email/password
2. Server validates credentials
3. JWT tokens are issued (access + refresh)
4. Tokens stored in HTTP-only cookies
5. Access token expires in 15 minutes
6. Refresh token expires in 7 days
7. Automatic token refresh on expiry

### Security Features

- HTTP-only cookies (XSS protection)
- Secure cookies in production
- Token rotation on refresh
- Password hashing with bcrypt
- Rate limiting on auth endpoints

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/session` - Get current session

### Public Endpoints

#### Services
- `GET /api/services` - List services (paginated)
- `GET /api/services/:slug` - Get service by slug

#### Projects
- `GET /api/projects` - List projects (paginated)
- `GET /api/projects/:slug` - Get project by slug

#### Testimonials
- `GET /api/testimonials` - List testimonials
- `GET /api/testimonials/:id` - Get testimonial

#### Team Members
- `GET /api/team-members` - List team members
- `GET /api/team-members/:id` - Get team member

#### Brands
- `GET /api/brands` - List brands
- `GET /api/brands/:id` - Get brand

#### Site Settings
- `GET /api/site-settings/:slice` - Get settings slice

#### File Upload
- `POST /api/upload/presigned-url` - Generate presigned upload URL

### Admin Endpoints

All admin endpoints require authentication and are prefixed with `/api/admin/`:

- Services: CRUD operations + reorder
- Projects: CRUD operations + reorder
- Testimonials: CRUD operations
- Team Members: CRUD operations + reorder
- Brands: CRUD operations
- Site Settings: Update operations
- File Upload: Generate presigned URLs

All endpoints support:
- Pagination (`?page=1&limit=10`)
- Filtering and sorting
- Type-safe request/response handling

## 🗄️ Database

### Automatic Seeding

On first database connection, the following is automatically seeded:

- **Roles**: Super Admin, Admin, Customer
- **Default Admin**: Creates initial admin account
- **Sample Data**: Services, projects, testimonials, brands

### Customizing Seed Data

Edit files in `app/_server/lib/seed/`:

- `index.ts` - Seed functions
- `seedData.ts` - Seed data definitions

### Models

- Admin - Admin user accounts
- Role - User roles and permissions
- Service - Service offerings
- Project - Portfolio projects
- Testimonial - Client testimonials
- TeamMember - Team member profiles
- Brand - Client/partner brands
- SiteSettings - Site configuration
- ActivityLog - Activity tracking
- AuditLog - Audit trail
- EmailLog - Email tracking
- Notification - Notifications

## 🎯 Customization Guide

### Changing Default Admin Credentials

Edit `app/_server/lib/seed/index.ts`:

```typescript
export const DEFAULT_SUPER_ADMIN = {
  firstName: 'Your',
  lastName: 'Name',
  email: 'your-email@example.com',
  accountStatus: 'active',
};
```

### Adding a New Content Type

1. Create model in `app/_server/models/`
2. Create controllers in `app/_server/controllers/`
3. Create API routes in `app/api/`
4. Create admin pages in `app/admin/dashboard/`
5. Create store in `lib/store/`
6. Add to seed data if needed

### Customizing Branding

1. Edit site settings in admin panel
2. Update colors in `tailwind.config.ts`
3. Modify fonts in `app/globals.css`
4. Update company config in `app/_server/lib/config/environment.ts`

### Adding New Admin Pages

1. Create page in `app/admin/dashboard/`
2. Add route to `lib/constants/routing.ts`
3. Create API endpoints if needed
4. Add permissions if required

## 🚢 Deployment

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- MongoDB connection string
- Redis URL
- JWT secrets (use strong random strings)
- Email credentials
- R2 credentials (if using file uploads)
- Set `NODE_ENV=production`

### Deployment Platforms

#### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

#### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

#### Other Platforms

The app follows Next.js standards and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting

### Production Checklist

- [ ] Set all required environment variables
- [ ] Use production database (MongoDB Atlas)
- [ ] Use production Redis instance
- [ ] Configure proper CORS settings
- [ ] Set up error monitoring
- [ ] Configure CDN for static assets
- [ ] Set up SSL/HTTPS
- [ ] Change default admin credentials
- [ ] Review security settings
- [ ] Set up backups

## 🔒 Security Considerations

- ✅ JWT tokens in HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ Request validation with Zod
- ✅ Error handling (no sensitive data exposure)
- ✅ Rate limiting on auth endpoints
- ✅ CORS configuration
- ✅ Environment variable protection

### Recommendations

- Use strong JWT secrets (32+ characters)
- Enable HTTPS in production
- Regularly update dependencies
- Review and restrict permissions
- Monitor for suspicious activity
- Keep backups of your database

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `DB_URL` is correct
- Check MongoDB is running/accessible
- Ensure network/firewall allows connection
- Check connection string format

### Redis Connection Issues

- App continues without Redis but caching is disabled
- Verify `REDIS_URL` format
- Check Redis server is accessible

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check Node.js version (20+)
- Verify all environment variables are set

### Port Already in Use

```bash
PORT=3001 npm run dev
```

## 📚 Additional Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [TEMPLATE_COMPLETION_CHECKLIST.md](./TEMPLATE_COMPLETION_CHECKLIST.md) - Completion status

## 🤝 Contributing

This is a template repository. Feel free to:

- Fork and customize for your needs
- Report issues you encounter
- Suggest improvements
- Share your customizations

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Mongoose](https://mongoosejs.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev/)

## 📧 Support

For questions or issues:

1. Check the [SETUP.md](./SETUP.md) guide
2. Review existing issues
3. Open a new issue with details

---

**Made with ❤️ for developers who want to ship fast**

Happy coding! 🚀
