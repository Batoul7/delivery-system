const { body, validationResult } = require('express-validator');
const { validate } = require('../helpers/validate');

const locationRules = () => {
    return [
        body('driver')
            .notEmpty().withMessage('Driver is required.')
            .isMongoId().withMessage('Driver must be a valid MongoDB ObjectId.'),

        body('order')
            .notEmpty().withMessage('Order is required.')
            .isMongoId().withMessage('Order must be a valid MongoDB ObjectId.'),

        body('coordinates').notEmpty().withMessage('Coordinates are required.'),

        body('coordinates.type')
            .notEmpty().withMessage('Coordinates type is required.')
            .equals('Point').withMessage('Coordinates type must be "Point".'),

        body('coordinates.coordinates')
            .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of two numbers [longitude, latitude].'),

        body('coordinates.coordinates.*')
            .isFloat().withMessage('Each coordinate must be a number.'),

        body('coordinates.coordinates[0]')
            .custom((value) => value >= -180 && value <= 180)
            .withMessage('Longitude must be between -180 and 180.'),

        body('coordinates.coordinates[1]')
            .custom((value) => value >= -90 && value <= 90)
            .withMessage('Latitude must be between -90 and 90.')
    ];
};

module.exports = {
    locationRules,
    validate,
};
