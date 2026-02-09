# Database Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
Create `.env` file in backend folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eventlink_manager
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Run Migration & Seeder
```bash
# Run migration (creates database & tables)
npm run migrate

# Run seeder (adds sample data)
npm run seed

# Or run both at once
npm run migrate:fresh
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Schema

### Tables Created:
1. **Users** - User accounts with authentication
2. **Websites** - Website management
3. **Events** - Event information
4. **WebsiteEvents** - Links between websites and events
5. **EventChanges** - Tracks event modifications
6. **EventDateOverrides** - Custom date overrides per website

### Indexes Added:
- Username, Email indexes on Users
- WebsiteCode, Status indexes on Websites
- EventCode, EventDate indexes on Events
- Status indexes on WebsiteEvents and EventChanges

### Features:
✅ Foreign key constraints with CASCADE delete
✅ Unique constraints to prevent duplicates
✅ Timestamps for audit trail
✅ UTF8MB4 charset for emoji support
✅ InnoDB engine for transactions

## 🎯 Default Credentials

After migration, you can login with:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Editor Account (after seeding):**
- Username: `editor1`
- Password: `editor123`

## 📝 Sample Data (Seeder)

The seeder adds:
- 2 Editor users
- 5 Sample websites
- 5 Sample events
- 7 Website-Event links

## 🔧 Available Commands

```bash
# Database
npm run migrate        # Create database & tables
npm run seed          # Add sample data
npm run migrate:fresh # Reset database with fresh data
npm run db:reset      # Alias for migrate:fresh

# Server
npm start             # Production mode
npm run dev           # Development mode with auto-reload
```

## 🏗️ Architecture Highlights

### Migration Features:
- ✅ Reusable DatabaseManager class
- ✅ Organized table schemas
- ✅ Proper error handling
- ✅ Transaction support
- ✅ Index optimization
- ✅ Foreign key relationships

### Seeder Features:
- ✅ Centralized seed data
- ✅ Bulk insert optimization
- ✅ Reusable seed functions
- ✅ Password hashing
- ✅ IGNORE duplicates

## 🔒 Security

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens for authentication
- Foreign key constraints prevent orphaned records
- Unique constraints prevent duplicates

## 📈 Performance

- Indexes on frequently queried columns
- InnoDB engine for ACID compliance
- Bulk inserts for seeding
- Connection pooling in production

## 🐛 Troubleshooting

### Error: "Access denied for user"
- Check DB_USER and DB_PASSWORD in .env
- Ensure MySQL user has CREATE DATABASE privilege

### Error: "Database already exists"
- This is normal, migration uses IF NOT EXISTS
- Tables will be created if they don't exist

### Error: "Cannot find module"
- Run `npm install` in backend folder
- Check if all dependencies are installed

## 📚 Next Steps

1. ✅ Run migration
2. ✅ Run seeder (optional)
3. ✅ Start backend server
4. ✅ Start frontend (cd ../frontend && npm start)
5. ✅ Login with default credentials
6. ✅ Start building!

---

**Built with ❤️ using Professional Standards**
