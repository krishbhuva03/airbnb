# MongoDB Authentication Fix Guide

## Current Situation

✅ **Server is running** on port 8080  
❌ **MongoDB authentication failing** - Password is incorrect/outdated

I've tested multiple connection attempts with different password formats - all failed with "bad auth" error.

## How to Fix

### Option 1: Reset Password in MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in with your account
3. Click on **"Database Access"** in the left sidebar
4. Find user **`bhuvakrish03`**
5. Click **"Edit"** → **"Edit Password"**
6. Set a new password (avoid special characters for simplicity, or use `Kr!shBhuva2003` if that's what you want)
7. Click **"Update User"**
8. **Wait 1-2 minutes** for the change to propagate

Then update your `.env` file:
```bash
cd /Users/krishbhuva/Documents/GithubRepos/airbnb/server
```

Edit `.env`:
```env
MONGODB_URL=mongodb+srv://bhuvakrish03:YOUR_NEW_PASSWORD@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb
```

**Important:** If your password has special characters, URL-encode them:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

### Option 2: Get Fresh Connection String from Atlas

1. Go to MongoDB Atlas
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Update the `.env` file with the new string

### Option 3: Create New Free MongoDB Atlas Cluster

If you can't access the existing cluster:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account (or log in)
3. Create a new M0 FREE cluster
4. Create a database user
5. Whitelist IP: `0.0.0.0/0` (or your specific IP)
6. Get the connection string
7. Update `.env`

## Verify the Fix

After updating `.env`, the server will auto-restart (nodemon is running). Check console for:

```
Server started at 8080
Connected to MongoDB Atlas  ✅
```

Then test:
```bash
curl http://localhost:8080/api/property/get
```

Should return `[]` (empty array) instead of error.

## Need Help?

Let me know:
- ✅ **"Password updated"** - I'll verify the connection
- ✅ **"Can't access Atlas"** - I'll help create a new cluster
- ✅ **"Got new connection string"** - I'll update the `.env` file
