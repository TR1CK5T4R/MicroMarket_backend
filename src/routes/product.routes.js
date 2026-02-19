const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addFavorite,
    removeFavorite
} = require('../controllers/product.controller');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');

const { check } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

router.route('/')
    .get(getProducts)
    .post(
        protect,
        authorizeRoles('admin'),
        validate([
            check('title', 'Title is required').not().isEmpty(),
            check('price', 'Price must be a positive number').isFloat({ min: 0 }),
            check('description', 'Description is required').not().isEmpty(),
            check('category', 'Category is required').not().isEmpty(),
            check('countInStock', 'Count in stock must be a non-negative integer').isInt({ min: 0 }),
            check('image', 'Image URL is required').not().isEmpty(),
        ]),
        createProduct
    );

router.route('/:id')
    .get(getProductById)
    .put(
        protect,
        authorizeRoles('admin'),
        validate([
            check('title', 'Title must not be empty').optional().not().isEmpty(),
            check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
            check('description', 'Description must not be empty').optional().not().isEmpty(),
            check('category', 'Category must not be empty').optional().not().isEmpty(),
            check('countInStock', 'Count in stock must be a non-negative integer').optional().isInt({ min: 0 }),
            check('image', 'Image URL must not be empty').optional().not().isEmpty(),
        ]),
        updateProduct
    )
    .delete(protect, authorizeRoles('admin'), deleteProduct);

router.route('/:id/favorite')
    .post(protect, addFavorite)
    .delete(protect, removeFavorite);

module.exports = router;
