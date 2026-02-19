const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.post(
    '/register',
    validate([
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ]),
    registerUser
);

router.post(
    '/login',
    validate([
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ]),
    loginUser
);

router.get('/profile', protect, getUserProfile);

module.exports = router;
