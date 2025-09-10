const express = require('express');
const sendys = require('../controllers/sendys.controllers.js');
const router = express.Router();

router.get('/all', sendys.getAll);
router.get('/user', sendys.getUser);
router.get('/contacts', sendys.getContacts);
router.get('/references', sendys.getReferenceData);

router.get('/customer', sendys.getCustomer);
router.post('/customer/add', sendys.insertCustomer);

router.post('/tasks', sendys.addTasks);
router.post('/calls', sendys.addCallDetails);


module.exports = router