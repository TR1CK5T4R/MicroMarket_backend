const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed...'.red.inverse);

        // Create Users
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            isAdmin: true
        });

        const user1 = new User({
            name: 'Test User 1',
            email: 'testuser1@example.com',
            password: 'password123',
            role: 'user',
            isAdmin: false
        });

        const user2 = new User({
            name: 'Test User 2',
            email: 'testuser2@example.com',
            password: 'password123',
            role: 'user',
            isAdmin: false
        });

        const createdAdmin = await adminUser.save();
        const createdUser1 = await user1.save();
        const createdUser2 = await user2.save();

        const users = [createdAdmin, createdUser1, createdUser2];

        console.log('Users Created...'.green.inverse);

        // Create Products (All assigned to Admin)
        const products = [
            {
                title: 'Wireless Bluetooth Headphones',
                price: 89.99,
                description: 'High-quality wireless headphones with noise cancellation and long battery life.',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                category: 'Electronics',
                countInStock: 10,
                createdBy: createdAdmin._id
            },
            {
                title: 'Ergonomic Office Chair',
                price: 199.99,
                description: 'Comfortable office chair with lumbar support and adjustable height.',
                image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
                category: 'Home',
                countInStock: 5,
                createdBy: createdAdmin._id
            },
            {
                title: 'Mechanical Gaming Keyboard',
                price: 129.50,
                description: 'RGB mechanical keyboard with blue switches for the ultimate gaming experience.',
                image: 'https://images.unsplash.com/photo-1587829741301-3a055998a4d4?w=800&q=80',
                category: 'Electronics',
                countInStock: 15,
                createdBy: createdAdmin._id
            },
            {
                title: 'Smart Fitness Watch',
                price: 59.99,
                description: 'Track your steps, heart rate, and sleep with this sleek fitness tracker.',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                category: 'Electronics',
                countInStock: 20,
                createdBy: createdAdmin._id
            },
            {
                title: 'Premium Cotton T-Shirt',
                price: 25.00,
                description: 'Soft, breathable 100% cotton t-shirt available in various colors.',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
                category: 'Clothing',
                countInStock: 50,
                createdBy: createdAdmin._id
            },
            {
                title: 'Stainless Steel Water Bottle',
                price: 35.00,
                description: 'Insulated water bottle to keep your drinks hot or cold for hours.',
                image: 'https://images.unsplash.com/photo-1602143407151-0111d2eef295?w=800&q=80',
                category: 'Home',
                countInStock: 30,
                createdBy: createdAdmin._id
            },
            {
                title: 'Minimalist Desk Lamp',
                price: 45.99,
                description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
                category: 'Home',
                countInStock: 12,
                createdBy: createdAdmin._id
            },
            {
                title: 'Leather Wallet',
                price: 75.00,
                description: 'Handcrafted genuine leather wallet with RFID protection.',
                image: 'https://images.unsplash.com/photo-1627123424574-183ce517a60d?w=800&q=80',
                category: 'Clothing',
                countInStock: 25,
                createdBy: createdAdmin._id
            },
            {
                title: 'Noise Cancelling Earbuds',
                price: 149.99,
                description: 'Compact wireless earbuds with active noise cancellation and deep bass.',
                image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
                category: 'Electronics',
                countInStock: 8,
                createdBy: createdAdmin._id
            },
            {
                title: 'Yoga Mat',
                price: 29.99,
                description: 'Non-slip yoga mat made from eco-friendly materials.',
                image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&q=80',
                category: 'Sports',
                countInStock: 40,
                createdBy: createdAdmin._id
            }
        ];

        await Product.insertMany(products);
        console.log('Products Imported!'.green.inverse);

        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

seedData();
