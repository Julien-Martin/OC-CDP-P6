const express = require('express');
const router = express.Router();

const {Users} = require('../controllers');

router.get('/', Users.findMe);
router.put('/', Users.update);
router.delete('/', Users.delete);

module.exports = router;