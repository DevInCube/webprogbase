var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	if (req.session.user) {
		return next();
	} else {
		res.render('notallowed');
	}
});

/* GET users listing. */
router.get('/profile', function(req, res, next) {
	const username = req.session.user.name;
	res.render('profile', { username: username });
});

module.exports = router;
