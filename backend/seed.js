const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const connectDB = require('./config/db');

const seedUsers = [
    {
        name: 'Sanitation Dept',
        email: 'sanitation@civic.gov',
        phone: '1234567890',
        password: 'admin123',
        role: 'department',
        department_name: 'Sanitation Department',
    },
    {
        name: 'Public Works Dept',
        email: 'pwd@civic.gov',
        phone: '1234567891',
        password: 'admin123',
        role: 'department',
        department_name: 'Public Works Department',
    },
    {
        name: 'Police Dept',
        email: 'police@civic.gov',
        phone: '1234567892',
        password: 'admin123',
        role: 'department',
        department_name: 'Police Department',
    },
];

async function seed() {
    await connectDB();
    console.log('Seeding department users...');

    for (const userData of seedUsers) {
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
            console.log(`  ✓ ${userData.email} already exists, skipping`);
            continue;
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({ ...userData, password: hashedPassword });
        console.log(`  ✓ Created ${userData.email}`);
    }

    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
