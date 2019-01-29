const express = require('express');
const router = express.Router();

const {Products} = require('../controllers');

router.get('/', Products.findMyProducts);
router.get('/:id', Products.findOne);
router.post('/', Products.create);
router.put('/:id', Products.update);
router.delete('/:id', Products.delete);

module.exports = router;