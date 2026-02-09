# EventLink Manager

A full-stack Admin Dashboard application for managing websites and their events with upcoming events integration.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MySQL

## Features

### 1. Website Management
- CRUD operations (Create, Read, Update, Delete)
- Search by WebsiteCode or BaseURL
- Filter by Status (Active/Inactive)
- Bulk CSV import
- Table view with actions

### 2. Event Management
- **Fetch upcoming events from external API**
- Display events with images and links
- Track linked websites for each event
- Highlight event changes (date, location, name)
- Manual approval workflow for changes
- Search and filter by EventCode, Name, or Date
- Visual indicators for pending changes

### 3. User Management
- Login system with JWT authentication
- User roles (Admin, Editor)
- Admin-only user CRUD operations

## Setup Instructions

### 1. Database Setup

```bash
cd backend
npm install
npm run migrate
npm run seed  # Optional: Add sample data
```

### 2. Backend Setup

```bash
cd backend
npm install
# Update .env file with your database credentials
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

## Default Login Credentials

- **Admin**: username=`admin`, password=`admin123`
- **Editor**: username=`editor1`, password=`editor123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Websites
- `GET /api/websites` - Get all websites (with search & filter)
- `GET /api/websites/:id` - Get single website
- `POST /api/websites` - Create website
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website
- `POST /api/websites/import/csv` - Bulk import from CSV

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - **Fetch upcoming events from external API**
- `GET /api/events/:eventCode/websites` - Get linked websites for an event
- `POST /api/events/sync` - Sync events from external API
- `GET /api/events/changes/pending` - Get pending changes
- `PUT /api/events/changes/:id` - Approve/Reject change
- `POST /api/events/link` - Link event to website

## Upcoming Events Feature

### External API Integration
The `/api/events/upcoming` endpoint fetches events from an external API with the following fields:
- `id` or `eventcode` - Unique event identifier
- `eventname` - Event name
- `eventdate` - Event date
- `eventlocation` - Event location
- `eventlink` - Event URL
- `image` - Event image URL
- `hoverimage` - Event hover image URL

### Change Detection & Approval
- Automatically detects changes in event date or location
- Highlights events with pending changes (yellow border)
- Admin can approve or reject changes
- Changes only applied after manual approval

### Linked Websites
- Each event can be linked to multiple websites
- Track `RelatedEventLink` for each website-event relationship
- View all websites where an event appears
- Clickable links to websites and event pages

## CSV Import Format

Create a CSV file with the following columns:

```csv
WebsiteCode,BaseURL,Status
SITE001,https://example1.com,Active
SITE002,https://example2.com,Inactive
```

## Database Schema

### Tables
- **Users** - User accounts with roles
- **Websites** - Website information
- **Events** - Event details with images and links
- **WebsiteEvents** - Links between websites and events
- **EventChanges** - Tracks pending event changes

## Project Structure

```
eventLink-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── websites.js
│   │   ├── users.js
│   │   └── events.js
│   ├── uploads/
│   ├── .env
│   ├── migrate.js
│   ├── seeder.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── Websites.js
│   │   │   ├── Events.js
│   │   │   └── Users.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── database/
│   └── schema.sql
├── sample-websites.csv
└── README.md
```

## Usage

### Fetch Upcoming Events
1. Navigate to Events page
2. Click "Refresh Events" button
3. System fetches from external API and stores in database
4. Events with changes are highlighted

### Approve Event Changes
1. Pending changes appear at the top of Events page
2. Review old vs new values
3. Click "Approve" or "Reject"
4. Approved changes update the event

### Link Events to Websites
1. Select an event from the list
2. View linked websites on the right panel
3. Each link shows status (Pending/Approved/Rejected)
4. Click website URLs to visit

## Notes

- Make sure MySQL server is running before starting the backend
- Update the `.env` file with your database credentials
- External API URL in `backend/routes/events.js` line 11 needs to be configured
- For production, change `JWT_SECRET` in .env file
- Run migrations before first use: `npm run migrate`
- Use seeder for test data: `npm run seed`
