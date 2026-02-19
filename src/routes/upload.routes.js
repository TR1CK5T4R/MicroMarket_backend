const express = require('express');
const router = express.Router();
const path = require('path');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');
const { upload, deleteLocalFile } = require('../middlewares/upload.middleware');
const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * POST /api/upload
 * Accepts a single image file in the field named "image".
 * Saves locally → uploads to Cloudinary → deletes local copy → returns URL.
 *
 * Access: Admin only
 */
router.post(
    '/',
    protect,
    authorizeRoles('admin'),
    upload.single('image'),  // field name must be "image"
    async (req, res, next) => {
        // If multer rejected the file (wrong type / size), req.file is undefined
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided or file type not allowed' });
        }

        const localPath = req.file.path;

        try {
            // ── Step 1: Upload local file to Cloudinary ──
            const { url, publicId } = await uploadToCloudinary(localPath);

            // ── Step 2: Delete local temp file (even on success) ──
            deleteLocalFile(localPath);

            res.status(201).json({
                message: 'Image uploaded successfully',
                url,
                publicId,
            });
        } catch (err) {
            // ── On any error: delete local file then pass error downstream ──
            deleteLocalFile(localPath);
            next(err);
        }
    }
);

module.exports = router;
