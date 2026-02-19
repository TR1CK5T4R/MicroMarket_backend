const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                isAdmin: true
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: 'password123',
                isAdmin: false
            }
        ]);

        const adminUser = users[0]._id;

        const sampleProducts = Array.from({ length: 12 }).map((_, i) => ({
            createdBy: adminUser,
            title: `Premium Product ${i + 1}`,
            image: `https://picsum.photos/seed/${i + 1}/500/500`,
            description: 'This is a premium product description. It highlights features, benefits, and specifications that are important to the customer.',
            category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Clothing' : 'Home',
            price: (Math.random() * 100 + 10).toFixed(2),
            countInStock: 10,
            rating: 4.5,
            numReviews: 12
        }));

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
