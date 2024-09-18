const PlayerService = require('../services/playerService');
const Player = require('../models/player');
const CustomError = require('../utils/customError');

describe('PlayerService.deletePlayer', () => {
    it('should delete an existing player', async () => {
        Player.findOneAndDelete = jest.fn().mockResolvedValue({ id: '12345' });

        await expect(PlayerService.deletePlayer('12345')).resolves.not.toThrow();
        expect(Player.findOneAndDelete).toHaveBeenCalledWith({ id: '12345' });
    });

    it('should handle errors if the player is not found', async () => {
        Player.findOneAndDelete = jest.fn().mockResolvedValue(null);

        await expect(PlayerService.deletePlayer('12345')).rejects.toThrow(CustomError);
    });
});
