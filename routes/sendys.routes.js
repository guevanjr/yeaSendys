const express = require('express');
const sendys = require('../controllers/sendys.controllers.js');
const router = express.Router();

//router.get('/all', sendys.getAll);
//router.get('/user', sendys.getUser);
router.get('/contacts', sendys.getContacts);
//router.post('/contacts/', sendys.addContacts);

router.get('/references', sendys.getReferenceData);
//router.post('/address', sendys.addAddress);

router.get('/customer', sendys.getCustomer);
router.post('/customer/', sendys.insertCustomer);

router.post('/tasks', sendys.addTasks);
router.post('/calls', sendys.addCallDetails);


module.exports = router