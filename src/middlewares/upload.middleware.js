const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Temp upload directory ───────────────────────────────────
// Vercel's filesystem is read-only except /tmp.
// Local dev:   uploads/temp/  (easy to inspect)
// Production:  /tmp           (only writable path on serverless)
const UPLOAD_DIR =
    process.env.NODE_ENV === 'production'
        ? '/tmp'
        : path.join(__dirname, '..', '..', 'uploads', 'temp');

// Ensure the temp dir exists at startup (no-op on Vercel where /tmp always exists)
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Disk storage ─────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        // timestamp + original extension  →  e.g. 1708398012345.jpg
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}${ext}`);
    },
});

// ── File filter — images only ─────────────────────────────────
const fileFilter = (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);

    if (extOk && mimeOk) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, avif)'), false);
    }
};

// ── Multer instance ───────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5 MB max
    },
});

/**
 * Delete a local file safely (no-throw).
 * Call after Cloudinary upload succeeds or on error cleanup.
 *
 * @param {string} filePath  Absolute path
 */
const deleteLocalFile = (filePath) => {
    if (!filePath) return;
    fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Failed to delete local temp file:', err.message);
        }
    });
};

module.exports = { upload, deleteLocalFile, UPLOAD_DIR };
