# Setup Instructions

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/syntax_db?retryWrites=true&w=majority

# Google Gemini AI (for AI Assistant)
GEMINI_API_KEY=your_gemini_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=syntaxsoftwaresolution@gmail.com
```

## Getting API Keys

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string from the dashboard
4. Replace `your_username`, `your_password`, and `your_cluster` in the MONGODB_URI

### Google Gemini API
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it as GEMINI_API_KEY

### NextAuth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```

### SMTP (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use the app password as SMTP_PASSWORD

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Seeding the Database

To populate the database with sample data:

```bash
npm run seed
```

## Admin Access

Default admin credentials (you'll need to create these in the database):
- Email: admin@syntax.com
- Password: (set during initial setup)

## Fixes Applied

1. ✅ Blog page - Added fallback sample data when database is unavailable
2. ✅ Admin dashboard - Updated all API routes to use Mongoose instead of MongoDB driver
3. ✅ Installed next-auth for authentication
4. ✅ Removed FloatingActionButton to eliminate UI conflicts
5. ✅ Contact page - No duplicate message box found (already clean)

## Remaining Tasks

- Add GEMINI_API_KEY to .env.local (user must do manually)
- Add MONGODB_URI to .env.local (user must do manually)
- Configure NEXTAUTH_SECRET in .env.local (user must do manually)
