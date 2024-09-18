const PlayerService = require('../services/playerService');
const Player = require('../models/player');
const CustomError = require('../utils/customError');

jest.mock('../models/player'); // Mock the Player model

describe('PlayerService.updatePlayer', () => {
    it('should update and return an existing player', async () => {
        const mockId = 'playerId';
        const mockPlayerUpdate = {
            name: 'Updated Player',
            position: 'Updated Position',
            playerSkills: [{ skill: 'defense', value: 95 }]
        };

        const mockExistingPlayer = {
            id: mockId,
            name: 'Old Player',
            position: 'Old Position',
            playerSkills: [{ skill: 'defense', value: 90 }],
            save: jest.fn().mockResolvedValue({
                id: mockId,
                ...mockPlayerUpdate
            })
        };

        Player.findOne = jest.fn().mockResolvedValue(mockExistingPlayer);

        const result = await PlayerService.updatePlayer(mockId, mockPlayerUpdate);

        expect(result).toEqual({
            id: mockId,
            ...mockPlayerUpdate
        });
        expect(Player.findOne).toHaveBeenCalledWith({ id: mockId });
        expect(mockExistingPlayer.save).toHaveBeenCalledTimes(1);
    });

    it('should handle player not found and throw CustomError', async () => {
        const mockId = 'playerId';
        const mockPlayerUpdate = {
            name: 'Updated Player',
            position: 'Updated Position',
            playerSkills: [{ skill: 'defense', value: 95 }]
        };

        Player.findOne = jest.fn().mockResolvedValue(null); // Simulate player not found

        await expect(PlayerService.updatePlayer(mockId, mockPlayerUpdate)).rejects.toThrow(CustomError);
    });
});
