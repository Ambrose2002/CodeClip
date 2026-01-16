# Render Deployment Guide

This guide will help you deploy the CodeClip backend to Render.

## Prerequisites

- GitHub account
- Render account (free tier works)
- Backend code pushed to GitHub

## Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `codeclip-db`
   - **Region**: Choose closest to you
   - **Plan**: Free (or paid if needed)
4. Click **Create Database**
5. After creation, copy the **Internal Database URL** (you'll need this later)

## Step 2: Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select the repository and branch

### Configure Service

**Basic Settings:**

- **Name**: `codeclip-backend` (or your choice)
- **Region**: Same as your database
- **Root Directory**: `backend`
- **Runtime**: Python 3

**Build & Deploy:**

- **Build Command**:

  ```bash
  pip install -r requirements.txt
  ```

- **Start Command**:
  ```bash
  gunicorn src.app:app --bind 0.0.0.0:$PORT
  ```

**Plan:**

- Choose Free or paid plan

## Step 3: Configure Environment Variables

In the **Environment** section, add these variables:

### Required Variables

| Variable          | Value                            | Description                         |
| ----------------- | -------------------------------- | ----------------------------------- |
| `DATABASE_URL`    | _(paste from Step 1)_            | Render PostgreSQL connection string |
| `SECRET_KEY`      | _(generate random string)_       | Flask session secret key            |
| `ALLOWED_ORIGINS` | `chrome-extension://YOUR_EXT_ID` | Your Chrome extension ID            |

### Optional Variables

| Variable         | Value        | Description                   |
| ---------------- | ------------ | ----------------------------- |
| `FLASK_ENV`      | `production` | Sets Flask to production mode |
| `PYTHON_VERSION` | `3.10.0`     | Specify Python version        |

**To generate SECRET_KEY**, run in terminal:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically:

   - Install dependencies
   - Create database tables
   - Start the server

3. Monitor the **Logs** tab for:

   - ✅ "Using PostgreSQL database"
   - ✅ "Database tables created successfully"
   - ✅ "Listening on 0.0.0.0:10000"

4. Your backend will be available at:
   ```
   https://codeclip-backend.onrender.com
   ```

## Step 5: Update Chrome Extension

Update your extension to use the production URL:

1. **In `background.js`** or wherever you make API calls, change:

   ```javascript
   const API_BASE_URL = "https://codeclip-backend.onrender.com/api";
   ```

2. **In `manifest.json`**, add host permissions:

   ```json
   {
     "host_permissions": ["https://codeclip-backend.onrender.com/*"]
   }
   ```

3. **Rebuild extension**:

   ```bash
   cd frontend
   npm run build
   ```

4. **Reload extension** in Chrome

## Step 6: Verify Deployment

Test your endpoints:

1. **Health Check** (if you have one):

   ```bash
   curl https://codeclip-backend.onrender.com/
   ```

2. **Sign Up**:

   ```bash
   curl -X POST https://codeclip-backend.onrender.com/api/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. Use your Chrome extension to:
   - Sign up
   - Log in
   - Save a snippet
   - View snippets

## Important Notes

### Database Connection

- Render provides `DATABASE_URL` automatically
- The app automatically detects and uses it
- Local development still uses SQLite

### CORS Configuration

- Make sure `ALLOWED_ORIGINS` includes your extension ID
- Format: `chrome-extension://YOUR_EXTENSION_ID`
- No trailing slash

### Session Cookies

- `SESSION_COOKIE_SECURE=True` is required for HTTPS
- `SESSION_COOKIE_SAMESITE=None` allows cross-origin cookies
- Your extension must use `credentials: "include"` in fetch requests

### Free Tier Limitations

- Database spins down after 90 days of inactivity
- Service spins down after 15 minutes of inactivity (takes 30-60s to wake up)
- 750 hours/month free (enough for one service)

## Troubleshooting

### Import Errors

**Problem**: `ModuleNotFoundError: No module named 'src'`

**Solution**: Make sure Root Directory is set to `backend` in Render settings

### Database Connection Failed

**Problem**: Can't connect to database

**Solution**:

1. Verify `DATABASE_URL` is set correctly
2. Make sure database and web service are in same region
3. Check database is not paused

### CORS Errors

**Problem**: "Access-Control-Allow-Origin" error

**Solution**:

1. Add your extension ID to `ALLOWED_ORIGINS`
2. Ensure `supports_credentials: true` in both backend and extension
3. Check extension uses `credentials: "include"` in fetch

### Session Not Persisting

**Problem**: Logged out after refresh

**Solution**:

1. Verify `SECRET_KEY` is set
2. Check cookies are being sent/received in Network tab
3. Ensure `SESSION_COOKIE_SECURE=True` (required for HTTPS)

## Updating Your Deployment

When you push to GitHub:

1. Render automatically detects changes
2. Rebuilds and redeploys
3. Monitor in Logs tab

## Manual Redeploy

If needed, you can manually trigger:

1. Go to your service in Render dashboard
2. Click **Manual Deploy** → **Deploy latest commit**

## Database Migrations

For schema changes:

1. Update models in `db.py`
2. Push to GitHub
3. Render will automatically run `db.create_all()`
   - This only creates new tables
   - For complex migrations, consider Flask-Migrate

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
