const { body, validationResult } = require('express-validator');

const playerValidator = (req, res, next) => {
    // Define valid positions and skills
    const validPositions = ['defender', 'midfielder', 'forward'];
    const validSkills = ['defense', 'speed', 'strength', 'stamina', 'attack'];

    const { name, position, playerSkills } = req.body;

    // Check if name is provided
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    // Check if position is valid
    if (!validPositions.includes(position)) {
        return res.status(400).json({
            message: `Invalid value for position: ${position}.`
        });
    }

    // Check if playerSkills is an array
    if (!Array.isArray(playerSkills)) {
        return res.status(400).json({ message: 'Player skills must be an array' });
    }

    // Check if playerSkills array is not empty
    if (playerSkills.length === 0) {
        return res.status(400).json({ message: 'At least one skill is required' });
    }

    // Create a Set to track unique skills
    const skillNames = playerSkills.map(skill => skill.skill);
    const skillNamesSet = new Set(skillNames);

    // Check for duplicate skills
    if (skillNames.length !== skillNamesSet.size) {
        return res.status(400).json({ message: 'Duplicate skills are not allowed' });
    }

    // Validate each skill object in the array
    for (let i = 0; i < playerSkills.length; i++) {
        const { skill, value } = playerSkills[i];

        // Check if skill is valid
        if (!validSkills.includes(skill)) {
            return res.status(400).json({
                message: `Invalid value for skill: ${skill}.`
            });
        }

        // Check if skill value is an integer between 0 and 100
        if (!Number.isInteger(value) || value < 0 || value > 100) {
            return res.status(400).json({
                message: `Invalid value for skill value: ${value}. It should be an integer between 0 and 100.`
            });
        }
    }

    // If validation passes we proceed
    next();
};

module.exports = playerValidator;
