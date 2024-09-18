const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerController');
const playerValidator = require('../validators/playerValidator');
const AuthMiddleware = require('../utils/AuthMiddleware');

// get all players
router.get('/player', PlayerController.getAllPlayers);

// create a new player
router.post('/', playerValidator, PlayerController.createPlayer);

// delete a player
router.delete('/player/:id', AuthMiddleware, PlayerController.deletePlayer);


module.exports = router;