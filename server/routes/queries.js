const express = require('express');
const {getQueries} = require('../controllers/query.controllers')
const router = express.Router();

router.get('/getQueries', getQueries);

module.exports = router;