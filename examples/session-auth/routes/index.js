var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	const user = req.session.user;
	res.render('index', { user: user });
});

router.get('/login', function(req, res, next) {
	req.session.user = { name: 'Ruslan' };
	res.redirect('/');
});

router.get('/logout', function(req, res, next) {
	delete req.session.user;
	res.redirect('/');
});

module.exports = router;
