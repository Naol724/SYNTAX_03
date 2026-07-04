# Deployment Guide

This guide covers deploying the Syntax Software Solutions website to various platforms.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Email service (Gmail/SMTP) configured
- Domain name configured (optional)
- Git repository

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/syntax

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=syntaxsoftwaresolution@gmail.com

# Gemini API (for AI Chatbot)
GEMINI_API_KEY=your-gemini-api-key

# Application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Generating NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

### Setting Up Email

For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password as `EMAIL_PASSWORD`

## Deployment Options

### Vercel (Recommended)

Vercel is the recommended deployment platform for Next.js applications.

#### Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deploy**
```bash
vercel --prod
```

#### Environment Variables in Vercel

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add all the variables from `.env.local`
4. Redeploy after adding variables

### Render

Render is another great option for deployment.

#### Steps

1. **Create a Render account** at [render.com](https://render.com)

2. **Connect your GitHub repository**

3. **Create a new Web Service**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Node Version: 18

4. **Add Environment Variables**
   - Add all variables from `.env.local` in the Render dashboard

5. **Deploy**
   - Render will automatically deploy on push to main branch

### Custom Server (VPS)

For full control, deploy to your own VPS.

#### Steps

1. **Server Setup**
```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

2. **Clone Repository**
```bash
git clone your-repo-url
cd SYNTAX_03
```

3. **Install Dependencies**
```bash
npm install
```

4. **Build Application**
```bash
npm run build
```

5. **Setup Environment**
```bash
cp .env.example .env.local
nano .env.local
# Add your environment variables
```

6. **Start with PM2**
```bash
pm2 start npm --name "syntax-website" -- start
pm2 save
pm2 startup
```

7. **Setup Nginx (Optional)**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **Setup SSL with Certbot (Optional)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Domain Configuration

### Vercel

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

### Render

1. Go to your service settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Render

### Custom Server

1. Point your domain's A record to your server IP
2. Configure Nginx as shown above
3. Setup SSL with Certbot

## MongoDB Atlas Setup

1. **Create Account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your server

3. **Database Access**
   - Create database user with username and password
   - Grant read/write access

4. **Network Access**
   - Add IP address: `0.0.0.0/0` (allows all IPs)
   - Or add specific server IPs

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use as `MONGODB_URI` in environment variables

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Email notifications tested
- [ ] AI chatbot configured with API key
- [ ] Admin login working
- [ ] All pages loading correctly
- [ ] Forms (contact, booking, newsletter) working
- [ ] SSL certificate installed (if using custom domain)
- [ ] Analytics tracking configured (optional)
- [ ] Backup strategy in place

## Monitoring and Maintenance

### Logs

**Vercel:**
```bash
vercel logs
```

**Render:**
- View logs in Render dashboard

**PM2:**
```bash
pm2 logs syntax-website
```

### Updates

To update the application:

```bash
git pull origin main
npm install
npm run build
pm2 restart syntax-website
```

### Backups

- MongoDB Atlas has automatic backups
- Consider backing up uploaded images/media
- Keep environment variables secure

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Error

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure database user has correct permissions
- Check if IP is whitelisted

### Email Not Sending

- Verify email credentials
- Check SMTP port (587 for TLS)
- Test with email provider's test tool
- Check if 2FA app password is used for Gmail

### Port Already in Use

```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

## Support

For issues or questions:
- Email: syntaxsoftwaresolution@gmail.com
- Phone: +251 945 455 141
