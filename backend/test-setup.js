const db = require('./config/db');
const { ROLES, STATUS } = require('./constants');

async function testBackend() {
  console.log('🧪 Testing Backend Setup...\n');

  try {
    // Test database connection
    console.log('1️⃣ Testing database connection...');
    const [result] = await db.query('SELECT 1 as test');
    console.log('   ✅ Database connected\n');

    // Test Users table
    console.log('2️⃣ Testing Users table...');
    const [users] = await db.query('SELECT COUNT(*) as count FROM Users');
    console.log(`   ✅ Users table: ${users[0].count} records\n`);

    // Test Websites table
    console.log('3️⃣ Testing Websites table...');
    const [websites] = await db.query('SELECT COUNT(*) as count FROM Websites');
    console.log(`   ✅ Websites table: ${websites[0].count} records\n`);

    // Test Events table
    console.log('4️⃣ Testing Events table...');
    const [events] = await db.query('SELECT COUNT(*) as count FROM Events');
    console.log(`   ✅ Events table: ${events[0].count} records\n`);

    // Test WebsiteEvents table
    console.log('5️⃣ Testing WebsiteEvents table...');
    const [websiteEvents] = await db.query('SELECT COUNT(*) as count FROM WebsiteEvents');
    console.log(`   ✅ WebsiteEvents table: ${websiteEvents[0].count} records\n`);

    // Test Constants
    console.log('6️⃣ Testing Constants...');
    console.log(`   ✅ ROLES: ${Object.keys(ROLES).join(', ')}`);
    console.log(`   ✅ STATUS: ${Object.keys(STATUS).join(', ')}\n`);

    // Test Utilities
    console.log('7️⃣ Testing Utilities...');
    const ApiResponse = require('./utils/ApiResponse');
    const asyncHandler = require('./utils/asyncHandler');
    const Validator = require('./utils/Validator');
    const HttpClient = require('./utils/HttpClient');
    const DatabaseManager = require('./utils/DatabaseManager');
    console.log('   ✅ ApiResponse loaded');
    console.log('   ✅ asyncHandler loaded');
    console.log('   ✅ Validator loaded');
    console.log('   ✅ HttpClient loaded');
    console.log('   ✅ DatabaseManager loaded\n');

    console.log('=' .repeat(50));
    console.log('🎉 All tests passed! Backend is ready!');
    console.log('=' .repeat(50));
    console.log('\n📝 Next Steps:');
    console.log('   1. Run: npm start (or npm run dev)');
    console.log('   2. Server will start on http://localhost:5000');
    console.log('   3. Test login with admin/admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testBackend();
