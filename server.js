const dotenv = require('dotenv');
// Load env vars
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to database once.
// In Vercel serverless, this function is called per cold start.
// Mongoose caches the connection internally — subsequent warm invocations reuse it.
connectDB();

// ── Local dev: start HTTP server ─────────────────────────────
// Vercel ignores this block; it invokes the exported handler directly.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

// ── Vercel serverless export ──────────────────────────────────
module.exports = app;
