const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerController');
const playerValidator = require('../validators/playerValidator');

// get all players
router.get('/player', PlayerController.getAllPlayers);

// create a new player
router.post('/', playerValidator, PlayerController.createPlayer);


module.exports = router;