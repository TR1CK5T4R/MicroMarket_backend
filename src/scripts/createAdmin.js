/**
 * Admin seeder — creates an admin user in the database.
 * Run once: node src/scripts/createAdmin.js
 *
 * Requirements:
 *   - .env file with MONGO_URI and JWT_SECRET present at project root
 *   - MongoDB running and accessible
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@micromarket.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await User.findOne({ email: ADMIN_EMAIL });

        if (existing) {
            if (existing.role !== 'admin') {
                // Upgrade to admin if the account already exists as a regular user
                existing.role = 'admin';
                await existing.save();
                console.log(`⬆️  Upgraded existing user "${ADMIN_EMAIL}" to admin role.`);
            } else {
                console.log(`ℹ️  Admin account "${ADMIN_EMAIL}" already exists — no changes made.`);
            }
        } else {
            await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin',
            });
            console.log(`✅ Admin user created:`);
            console.log(`   Email:    ${ADMIN_EMAIL}`);
            console.log(`   Password: ${ADMIN_PASSWORD}`);
            console.log(`   ⚠️  Change the password after first login!`);
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
})();
