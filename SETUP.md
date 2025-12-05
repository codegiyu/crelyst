# Setup Guide

Complete setup instructions for the Next.js 16 Template.

## Prerequisites

- Node.js 20.x or higher
- MongoDB database (local or Atlas)
- Redis instance (optional but recommended)
- Cloudflare R2 account (optional, for file uploads)
- Email service credentials (for SMTP)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd next-16-template
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory. Copy the template below and fill in your values:

```env
# Application Configuration
APP_NAME=next-16-template
APP_URL=http://localhost:3000
NODE_ENV=development

# Database Configuration (MongoDB)
DB_URL=mongodb://localhost:27017/your-database-name
# Or for MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

# JWT Configuration
# Generate secure random strings: openssl rand -base64 32
ACCESS_TOKEN_SECRET=your-access-token-secret-change-in-production
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-in-production
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Cookie Configuration (minutes for access, days for refresh)
ACCESS_COOKIE_EXPIRES_IN=15
REFRESH_COOKIE_EXPIRES_IN=7

# Email Configuration (SMTP)
FROM_EMAIL=noreply@example.com
TO_EMAIL=recipient@example.com
MAIL_PASSWORD=your-email-password
MAIL_HOST=smtp.example.com
MAIL_PORT=587

# Redis Configuration
REDIS_URL=redis://localhost:6379
CACHE_EXPIRY=3600

# Cloudflare R2 Configuration (Optional - for file uploads)
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_CDN_URL=https://cdn.yourdomain.com
R2_PUBLIC_URL=https://your-bucket.r2.dev
R2_FOLDER_PREFIX=staging-files
```

### 3. Database Setup

#### MongoDB Local
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `<password>` and `<dbname>` in the connection string

### 4. Redis Setup (Optional but Recommended)

#### Local Redis
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

#### Redis Cloud (Upstash, Redis Cloud)
1. Create an account
2. Create a database
3. Copy the connection URL to `REDIS_URL`

### 5. Run the Application

```bash
npm run dev
```

The application will:
- Connect to MongoDB
- Automatically seed the database with initial data
- Create a default super admin account

### 6. Access the Application

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/auth/login

#### Default Admin Credentials

After first run, you can login with:
- **Email**: `codegiyu@gmail.com` (from seed file)
- **Password**: `Password123` (from seed file)

**⚠️ Important**: Change these credentials immediately after first login!

## Database Seeding

The database is automatically seeded on first connection with:
- Default roles (Super Admin, Admin, Customer)
- Default super admin account
- Sample services, projects, testimonials, and brands

To customize the seed data, edit files in:
- `app/_server/lib/seed/index.ts` - Seed functions
- `app/_server/lib/seed/seedData.ts` - Seed data

## Configuration Details

### Environment Variables Explained

#### Required Variables

- `APP_NAME` - Application name
- `APP_URL` - Base URL of your application
- `DB_URL` - MongoDB connection string
- `ACCESS_TOKEN_SECRET` - Secret for JWT access tokens (use strong random string)
- `REFRESH_TOKEN_SECRET` - Secret for JWT refresh tokens (use strong random string)
- `REDIS_URL` - Redis connection URL
- `FROM_EMAIL` - Email address for sending emails
- `MAIL_HOST` - SMTP server hostname
- `MAIL_PASSWORD` - SMTP password

#### Optional Variables

- `R2_*` - Cloudflare R2 configuration (only if using file uploads)
- `COMPANY_*` - Company branding (only if using multi-company features)

### JWT Token Configuration

- `ACCESS_TOKEN_EXPIRES_IN` - Format: `15m`, `1h`, `7d`
- `REFRESH_TOKEN_EXPIRES_IN` - Format: `7d`, `30d`
- `ACCESS_COOKIE_EXPIRES_IN` - Minutes (number)
- `REFRESH_COOKIE_EXPIRES_IN` - Days (number)

## Troubleshooting

### Database Connection Issues

If MongoDB connection fails:
1. Verify `DB_URL` is correct
2. Check MongoDB is running (local) or accessible (Atlas)
3. Ensure network/firewall allows connection
4. Check connection string format

### Redis Connection Issues

If Redis is not available:
- The app will log warnings but continue
- Caching features will be disabled
- Job queues may not work properly

### Port Already in Use

If port 3000 is taken:
```bash
# Use a different port
PORT=3001 npm run dev
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Next Steps

1. **Customize Branding**: Update company information in `app/_server/lib/config/environment.ts`
2. **Change Admin Credentials**: Login and update password in admin panel
3. **Add Your Content**: Customize services, projects, and other content
4. **Configure Email**: Set up proper SMTP credentials
5. **Set Up File Storage**: Configure Cloudflare R2 for production file uploads

## Support

For issues or questions, please refer to the main README.md or open an issue in the repository.
