const express = require('express');
const router = express.Router();

const {Clients} = require('../controllers');

router.get('/', Clients.findMyClients);
router.get('/:id', Clients.findOne);
router.post('/', Clients.create);
router.put('/:id', Clients.update);
router.delete('/:id', Clients.delete);

module.exports = router;