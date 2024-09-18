const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerController');
const playerValidator = require('../validators/playerValidator');
const AuthMiddleware = require('../utils/AuthMiddleware');
const teamProcessValidator = require('../validators/teamProcessValidator');

// get all players
router.get('/player', PlayerController.getAllPlayers);

// create a new player
router.post('/player', playerValidator, PlayerController.createPlayer);

// update a player
router.put('/player/:id', playerValidator, PlayerController.updatePlayer);

// delete a player
router.delete('/player/:id', AuthMiddleware, PlayerController.deletePlayer);

// team choosing process
router.post('/team/process', teamProcessValidator, PlayerController.teamChoosingProcess);

module.exports = router;