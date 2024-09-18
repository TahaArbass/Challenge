const Player = require('../models/player');
const CustomError = require('../utils/customError');

class PlayerService {

    // get all players
    static async getAllPlayers() {
        try {
            return await Player.find({}, { _id: 0, __v: 0 });
        }
        catch (err) {
            throw new Error(err.message);
        }
    }

    // Create a new player
    static async createPlayer(player) {
        try {
            const createdPlayer = new Player(player);

            // Save the player
            await createdPlayer.save();

            // Update the playerSkills with the playerId
            createdPlayer.playerSkills.forEach(skill => {
                skill.playerId = createdPlayer.id;
            });

            // Save the updated player
            await createdPlayer.save();

            const newPlayer = {
                id: createdPlayer.id,
                name: createdPlayer.name,
                position: createdPlayer.position,
                playerSkills: createdPlayer.playerSkills
            };
            return newPlayer;
        }
        catch (err) {
            throw new CustomError(err.message, 400);
        }
    }

    // update a player
    static async updatePlayer(id, player) {
        // Update player 
        const existingPlayer = await Player.findOne({ id: id });

        // Check if player was found and updated
        if (!existingPlayer) {
            throw new CustomError('Player not found', 404);
        }

        // Update player details
        existingPlayer.name = player.name;
        existingPlayer.position = player.position;

        // Update each player skill
        // and add new skills if they don't exist and remove skills that are not in the request
        // Create a map of the existing skills
        const existingSkillsMap = new Map();
        existingPlayer.playerSkills.forEach(skill => {
            existingSkillsMap.set(skill.skill, skill);
        });

        const updatedSkills = [];
        player.playerSkills.forEach(newSkill => {
            const existingSkill = existingSkillsMap.get(newSkill.skill);

            if (existingSkill) {
                // Update the value of the existing skill
                existingSkill.value = newSkill.value;
                updatedSkills.push(existingSkill); // Keep the existing skill in the updated list
            } else {
                // Add new skill
                updatedSkills.push({
                    skill: newSkill.skill,
                    value: newSkill.value,
                    playerId: existingPlayer.id
                });
            }
        });

        // Replace the player's skills with the updated skills
        existingPlayer.playerSkills = updatedSkills;

        // Save updated player
        await existingPlayer.save();

        // remove _id and __v fields from the response
        const playerResponse = {
            id: existingPlayer.id,
            name: existingPlayer.name,
            position: existingPlayer.position,
            playerSkills: existingPlayer.playerSkills
        };

        return playerResponse;
    }


    // delete a player
    static async deletePlayer(id) {
        const deletedPlayer = await Player.findOneAndDelete({ id: id });
        // Check if player was found and deleted
        if (!deletedPlayer) {
            throw new CustomError('Player not found', 404);
        }
    }

    // team choosing process
    static async teamChoosingProcess(requirements) {
        const results = [];
        const usedPlayerIds = new Set(); // Track used player IDs to avoid duplicates

        // Loop through each requirement to find players
        for (const req of requirements) {
            const { position, mainSkill, numberOfPlayers } = req;

            // Step 1: Find players by position and add fields for sorting by mainSkill or maxSkill
            const players = await Player.aggregate([
                {
                    $match: {
                        position,
                        _id: { $nin: Array.from(usedPlayerIds) } // Exclude already used players
                    }
                },
                {
                    $addFields: {
                        mainSkillValue: {
                            $reduce: {
                                input: {
                                    $filter: {
                                        input: "$playerSkills",
                                        as: "skill",
                                        cond: { $eq: ["$$skill.skill", mainSkill] }
                                    }
                                },
                                initialValue: null,
                                in: "$$this.value"
                            }
                        },
                        maxSkillValue: { $max: "$playerSkills.value" }
                    }
                },
                {
                    // Step 2: Sort by mainSkillValue (descending) or by maxSkillValue if mainSkill is not found
                    $sort: {
                        mainSkillValue: -1,  // Sort by main skill value if it exists
                        maxSkillValue: -1    // Fallback sort by maximum skill value
                    }
                },
                {
                    // Step 3: Limit the results to the required number of players
                    $limit: numberOfPlayers
                },
                {
                    // Remove the fields before returning
                    $project: {
                        mainSkillValue: 0,
                        maxSkillValue: 0
                    }
                }
            ]);

            // Step 4: Check if we have enough players for this position
            if (players.length < numberOfPlayers) {
                throw new CustomError(`Insufficient number of players for position: ${position}`, 400);
            }

            // Step 5: Update the set of used player IDs and add the selected players to the results array
            players.forEach(player => {
                usedPlayerIds.add(player._id); // Track player ID as used
                delete player._id;
                delete player.__v;
            });

            results.push(...players);
        }

        return results;
    }

}
module.exports = PlayerService;