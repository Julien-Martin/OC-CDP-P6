const express = require('express');
const router = express.Router();

const {Invoices} = require('../controllers');

router.get('/', Invoices.findMyInvoices);
router.get('/:id', Invoices.findOne);
router.get('/client/:id', Invoices.findAllFromClient);
router.post('/', Invoices.create);

module.exports = router;