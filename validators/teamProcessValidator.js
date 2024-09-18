const teamProcessValidator = (req, res, next) => {
    // Define valid positions and skills
    const validPositions = ['forward', 'midfielder', 'defender'];
    const validSkills = ['stamina', 'speed', 'strength', 'defense', 'attack'];

    const requirements = req.body;

    // Create a Set to track unique skill-position combinations
    const seenCombinations = new Set();

    // validate each requirement
    for (let i = 0; i < requirements.length; i++) {
        const req = requirements[i];
        const { position, mainSkill, numberOfPlayers } = req;

        // Check if position is valid
        if (!validPositions.includes(position)) {
            return res.status(400).json({
                message: `Invalid value for position: ${position} at index ${i}. Valid positions are ${validPositions.join(', ')}.`
            });
        }

        // Check if mainSkill is valid
        if (!validSkills.includes(mainSkill)) {
            return res.status(400).json({
                message: `Invalid value for mainSkill: ${mainSkill} at index ${i}. Valid skills are ${validSkills.join(', ')}.`
            });
        }

        // Check if numberOfPlayers is a positive integer
        if (!Number.isInteger(numberOfPlayers) || numberOfPlayers <= 0) {
            return res.status(400).json({
                message: `Invalid value for numberOfPlayers: ${numberOfPlayers} at index ${i}. It should be a positive integer.`
            });
        }

        // Check for duplicate skill-position combinations
        const combination = `${position}-${mainSkill}`;
        if (seenCombinations.has(combination)) {
            return res.status(400).json({
                message: `Duplicate combination of position and mainSkill: ${combination} at index ${i}. Each combination must be unique.`
            });
        }
        seenCombinations.add(combination);
    }

    // If validation passes we proceed
    next();
};

module.exports = teamProcessValidator;
