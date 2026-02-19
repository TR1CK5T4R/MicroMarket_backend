/**
 * Cloudinary configuration
 * Replace the placeholder values via .env:
 *
 *   CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   CLOUDINARY_API_KEY=your_api_key
 *   CLOUDINARY_API_SECRET=your_api_secret
 */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
    api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
    secure: true,
});

/**
 * Upload a local file path to Cloudinary.
 * Puts images in the `micro-marketplace/products` folder.
 *
 * @param {string} localFilePath  Absolute path to file on disk
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadToCloudinary = async (localFilePath) => {
    const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'micro-marketplace/products',
        resource_type: 'image',
        transformation: [
            { width: 800, height: 1000, crop: 'limit' }, // Cap size, preserve aspect
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
        ],
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
};

/**
 * Delete an image from Cloudinary by its public_id.
 * Silently no-ops if publicId is falsy.
 *
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error('Cloudinary delete error:', err.message);
    }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
