const Product = require('../models/product.model');
const User = require('../models/user.model');

// @desc    Fetch all products with pagination and search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const pageSize = Number(req.query.limit) || 8;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.search
            ? {
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ]
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({
            products,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            totalCount: count
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        // CastError check
        if (error.name === 'CastError') {
            res.status(404);
            next(new Error('Product not found'));
        } else {
            next(error);
        }
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
    try {
        const { title, price, description, image, category, countInStock } = req.body;

        const product = new Product({
            title,
            price,
            description,
            image,
            category,
            countInStock,
            createdBy: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
    try {
        const { title, price, description, image, category, countInStock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Check ownership
            if (product.createdBy.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('User not authorized to update this product');
            }

            product.title = title || product.title;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check ownership
            if (product.createdBy.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error('User not authorized to delete this product');
            }

            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Add product to favorites
// @route   POST /api/products/:id/favorite
// @access  Private
const addFavorite = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { favorites: req.params.id }
        });

        res.status(200).json({ message: 'Product added to favorites' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        next(error);
    }
}

// @desc    Remove product from favorites
// @route   DELETE /api/products/:id/favorite
// @access  Private
const removeFavorite = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { favorites: req.params.id }
        });

        res.status(200).json({ message: 'Product removed from favorites' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addFavorite,
    removeFavorite
};
