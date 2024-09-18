const PlayerService = require('../services/playerService');
const Player = require('../models/player');

describe('PlayerService.teamChoosingProcess', () => {
    it('should return a team of players based on requirements', async () => {
        const requirements = [
            { position: 'forward', mainSkill: 'shooting', numberOfPlayers: 2 }
        ];

        const mockPlayers = [
            { name: 'Player1', position: 'forward', playerSkills: [{ skill: 'shooting', value: 90 }] },
            { name: 'Player2', position: 'forward', playerSkills: [{ skill: 'shooting', value: 85 }] }
        ];

        Player.aggregate = jest.fn().mockResolvedValue(mockPlayers);

        const result = await PlayerService.teamChoosingProcess(requirements);

        expect(result).toEqual(mockPlayers);
        expect(Player.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should handle errors and throw an error if insufficient players', async () => {
        const requirements = [
            { position: 'forward', mainSkill: 'shooting', numberOfPlayers: 5 }
        ];

        Player.aggregate = jest.fn().mockResolvedValue([]);

        await expect(PlayerService.teamChoosingProcess(requirements)).rejects.toThrow('Insufficient number of players for position: forward');
    });
});
