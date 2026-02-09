const bcrypt = require('bcrypt');
const DatabaseManager = require('./utils/DatabaseManager');

const SEED_DATA = {
  users: [
    { username: 'editor1', email: 'editor1@eventlink.com', role: 'Editor' },
    { username: 'editor2', email: 'editor2@eventlink.com', role: 'Editor' }
  ],
  
  websites: [
    { code: 'WEB001', url: 'https://example1.com', status: 'Active' },
    { code: 'WEB002', url: 'https://example2.com', status: 'Active' },
    { code: 'WEB003', url: 'https://example3.com', status: 'Inactive' },
    { code: 'WEB004', url: 'https://example4.com', status: 'Active' },
    { code: 'WEB005', url: 'https://example5.com', status: 'Active' }
  ],
  
  events: [
    { code: 'EVT001', name: 'Tech Conference 2024', date: '2024-06-15', location: 'New York' },
    { code: 'EVT002', name: 'Music Festival', date: '2024-07-20', location: 'Los Angeles' },
    { code: 'EVT003', name: 'Sports Championship', date: '2024-08-10', location: 'Chicago' },
    { code: 'EVT004', name: 'Art Exhibition', date: '2024-09-05', location: 'San Francisco' },
    { code: 'EVT005', name: 'Food Festival', date: '2024-10-12', location: 'Miami' }
  ],
  
  websiteEvents: [
    { website_id: 1, event_id: 1, status: 'Approved' },
    { website_id: 1, event_id: 2, status: 'Approved' },
    { website_id: 2, event_id: 1, status: 'Approved' },
    { website_id: 2, event_id: 3, status: 'Pending' },
    { website_id: 4, event_id: 2, status: 'Approved' },
    { website_id: 4, event_id: 4, status: 'Approved' },
    { website_id: 5, event_id: 5, status: 'Approved' }
  ]
};

async function seedUsers(db, password) {
  const values = SEED_DATA.users.map(u => `('${u.username}', ?, '${u.email}', '${u.role}')`).join(',');
  const params = SEED_DATA.users.map(() => password);
  
  await db.query(
    `INSERT IGNORE INTO Users (username, password, email, role) VALUES ${values}`,
    params
  );
  console.log(`  ✅ ${SEED_DATA.users.length} users`);
}

async function seedWebsites(db) {
  const values = SEED_DATA.websites.map(w => 
    `('${w.code}', '${w.url}', '${w.status}')`
  ).join(',');
  
  await db.query(
    `INSERT IGNORE INTO Websites (WebsiteCode, BaseURL, Status) VALUES ${values}`
  );
  console.log(`  ✅ ${SEED_DATA.websites.length} websites`);
}

async function seedEvents(db) {
  const values = SEED_DATA.events.map(e => 
    `('${e.code}', '${e.name}', '${e.date}', '${e.location}')`
  ).join(',');
  
  await db.query(
    `INSERT IGNORE INTO Events (EventCode, EventName, EventDate, Location) VALUES ${values}`
  );
  console.log(`  ✅ ${SEED_DATA.events.length} events`);
}

async function seedWebsiteEvents(db) {
  const values = SEED_DATA.websiteEvents.map(we => 
    `(${we.website_id}, ${we.event_id}, '${we.status}')`
  ).join(',');
  
  await db.query(
    `INSERT IGNORE INTO WebsiteEvents (website_id, event_id, Status) VALUES ${values}`
  );
  console.log(`  ✅ ${SEED_DATA.websiteEvents.length} website-event links`);
}

async function runSeeder() {
  const db = new DatabaseManager();

  await db.executeWithConnection(async (db) => {
    console.log('🔌 Connected to database\n');
    console.log('🌱 Seeding data...\n');

    const hashedPassword = await bcrypt.hash('editor123', 10);

    await seedUsers(db, hashedPassword);
    await seedWebsites(db);
    await seedEvents(db);
    await seedWebsiteEvents(db);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📝 Test Accounts:');
    console.log('   Admin:  username=admin,   password=admin123');
    console.log('   Editor: username=editor1, password=editor123');
    console.log('');
  }, true);
}

runSeeder().catch(console.error);
