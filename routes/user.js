const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/user', (req, res, next) => {
	res.render('user.ejs');
});

module.exports = router;
