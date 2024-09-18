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
            const createdPlayer = await Player.create(player);

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

    // delete a player
    static async deletePlayer(id) {
        try {
            await Player.deleteOne({ id: id });
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = PlayerService;