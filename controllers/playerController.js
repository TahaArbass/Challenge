const PlayerService = require('../services/playerService');
const CustomError = require('../utils/customError');

class PlayerController {
    // get all players
    static async getAllPlayers(req, res) {
        try {
            const players = await PlayerService.getAllPlayers();
            res.json(players);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // create a new player
    static async createPlayer(req, res) {
        try {
            const player = req.body;
            const newPlayer = await PlayerService.createPlayer(player);
            res.status(201).json(newPlayer);
        }
        catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            }
            else {
                res.status(500).json({ message: err.message });
            }
        }
    }

    // update a player
    static async updatePlayer(req, res) {
        try {
            const id = req.params.id;
            const player = req.body;
            const updatedPlayer = await PlayerService.updatePlayer(id, player);
            res.status(200).json(updatedPlayer);
        } catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            }
            else {
                res.status(500).json({ message: err.message });
            }
        }
    }

    // delete a player
    static async deletePlayer(req, res) {
        try {
            const id = req.params.id;
            await PlayerService.deletePlayer(id);
            res.status(200).json({ message: 'Player deleted successfully' });
        }
        catch (err) {
            if (err instanceof CustomError) {
                res.status(err.statusCode).json({ message: err.message });
            }
            else {
                res.status(500).json({ message: err.message });
            }
        }
    }

    // team choosing process
    static async teamChoosingProcess(req, res) {
        try {
            const requirements = req.body;
            const team = await PlayerService.teamChoosingProcess(requirements);
            res.status(200).json(team);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

module.exports = PlayerController;