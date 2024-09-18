const { body, validationResult } = require('express-validator');

// Middleware for validating player data
const playerValidator = [
    // Name should not be em    pty
    body('name')
        .notEmpty()
        .withMessage('Name is required').bail(),

    // Position must be one of the allowed values
    body('position').notEmpty().withMessage('Position is required').bail()
        .isIn(['defender', 'midfielder', 'forward'])
        .withMessage((value) => `Invalid value for position: ${value}`).bail(),

    // Ensure playerSkills is an array with at least one skill
    body('playerSkills')
        .isArray()
        .withMessage('Player skills must be an array').bail()
        .custom((skills) => {
            if (skills.length === 0) {
                throw new Error('At least one skill is required');
            }

            // Check for duplicate skills
            const skillNames = skills.map(skill => skill.skill);
            const skillNamesSet = new Set(skillNames);
            if (skillNames.length !== skillNamesSet.size) {
                throw new Error('Duplicate skills are not allowed');
            }

            return true;
        }).bail(),

    // Validate each skill object in the array
    body('playerSkills.*.skill')
        .isIn(['defense', 'speed', 'strength', 'stamina', 'attack'])
        .withMessage((value) => `Invalid value for skill: ${value}`).bail(),

    // Skill value must be an integer between 0 and 100
    body('playerSkills.*.value')
        .isInt({ min: 0, max: 100 })
        .withMessage((value) => `Invalid value for skill value: ${value}`).bail(),

    // Middleware to handle validation results and errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Get the first validation error
            const firstError = errors.array()[0];
            const message = firstError.msg;
            return res.status(400).json({ message });
        }
        next();
    }
];

module.exports = playerValidator;
