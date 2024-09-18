const PlayerService = require('../services/playerService');
const Player = require('../models/player');

describe('PlayerService.getAllPlayers', () => {
    it('should return all players without _id and __v fields', async () => {
        const mockPlayers = [{ name: 'Player1', position: 'forward', playerSkills: [] }];
        Player.find = jest.fn().mockResolvedValue(mockPlayers);

        const result = await PlayerService.getAllPlayers();

        expect(result).toEqual(mockPlayers);
        expect(Player.find).toHaveBeenCalledWith({}, { _id: 0, __v: 0 });
    });

    it('should handle errors thrown by Player.find', async () => {
        Player.find = jest.fn().mockRejectedValue(new Error('Database error'));

        await expect(PlayerService.getAllPlayers()).rejects.toThrow('Database error');
    });
});
