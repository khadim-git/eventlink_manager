# 🚀 Render.com Deployment Guide

## Problem: "Cannot GET /"

Yeh error isliye aa raha hai kyunki:
1. Backend aur Frontend alag deploy karne hain
2. Frontend build nahi hai
3. Environment variables set nahi hain

## ✅ Solution: 2 Services Deploy Karo

### Option 1: Separate Services (Recommended)

#### Step 1: Backend Deploy
1. **New Web Service** banao
2. **Repository** connect karo
3. **Settings:**
   ```
   Name: eventlink-backend
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=eventlink_manager
   JWT_SECRET=your_secret_key_here
   ```

5. **Deploy** karo
6. **Backend URL** copy karo (e.g., `https://eventlink-backend.onrender.com`)

#### Step 2: Frontend Deploy
1. **New Static Site** banao
2. **Repository** connect karo
3. **Settings:**
   ```
   Name: eventlink-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://eventlink-backend.onrender.com/api
   ```

5. **Deploy** karo

### Option 2: Single Service (Backend serves Frontend)

#### Update backend/server.js:
```javascript
const path = require('path');

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// All other routes return React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
```

#### Render Settings:
```
Build Command: npm install && cd frontend && npm install && npm run build && cd ../backend && npm install
Start Command: cd backend && npm start
```

## 🗄️ Database Setup

### Option 1: Render PostgreSQL (Free)
1. Create PostgreSQL database on Render
2. Update backend to use PostgreSQL instead of MySQL

### Option 2: External MySQL (Railway, PlanetScale)
1. Create MySQL database on Railway/PlanetScale
2. Get connection details
3. Add to Render environment variables

## 📝 Quick Fix for Current Deployment

### 1. Create package.json in root:
```json
{
  "name": "eventlink-manager",
  "version": "1.0.0",
  "scripts": {
    "install-all": "cd backend && npm install && cd ../frontend && npm install",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start"
  }
}
```

### 2. Update Render Settings:
```
Build Command: npm run install-all && npm run build
Start Command: npm start
```

### 3. Update backend/server.js:
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/websites', require('./routes/websites'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## 🔧 Environment Variables (Render Dashboard)

```
NODE_ENV=production
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=eventlink_manager
JWT_SECRET=your_random_secret_key_here
```

## ✅ Checklist

- [ ] Backend deployed and running
- [ ] Database connected
- [ ] Environment variables set
- [ ] Frontend built successfully
- [ ] API URL configured in frontend
- [ ] CORS enabled for frontend domain
- [ ] Health check endpoint working (`/api/health`)

## 🧪 Test Deployment

1. **Backend Health Check:**
   ```
   https://your-backend.onrender.com/api/health
   ```
   Should return: `{ status: 'OK', ... }`

2. **Frontend:**
   ```
   https://your-frontend.onrender.com
   ```
   Should show login page

3. **Login Test:**
   - Username: admin
   - Password: admin123

## 🐛 Common Issues

### "Cannot GET /"
- Frontend build missing
- Static files not served
- Wrong publish directory

### "Network Error"
- Backend not running
- Wrong API URL in frontend
- CORS not configured

### "Database connection failed"
- Wrong DB credentials
- Database not accessible from Render
- Firewall blocking connection

## 💡 Best Practice

Deploy as **2 separate services**:
1. **Backend** (Web Service) - Node.js
2. **Frontend** (Static Site) - React build

This is cleaner and easier to manage!

---

**Need help? Check Render logs for errors!**
