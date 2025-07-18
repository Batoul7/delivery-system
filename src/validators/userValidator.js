const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { validate } = require('../helpers/validate');

const registerRules = () => {
    return [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required.')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.'),

        body('email')
            .isEmail().withMessage('Please provide a valid email.')
            .normalizeEmail()
            .custom(async (email) => {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return Promise.reject('This email address is already in use.');
                }
            }),

        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
            .withMessage('Password must contain an uppercase letter, a lowercase letter, a number, and a special character.'),

        body('passwordConfirmation')
            .notEmpty().withMessage('Password confirmation is required.')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match the password.');
                }

                return true;
            }),
            
        body('phoneNumber')
            .trim().notEmpty().withMessage('Phone number is required.')
            .isMobilePhone('any', { strictMode: false }).withMessage('Invalid phone number format.')
    ];
};

module.exports = {
    registerRules,
    validate,
};