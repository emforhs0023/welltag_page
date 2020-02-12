module.exports = function(req, res, next) {
	if(req.isAuthenticated() == false) {
		return next();
	}

	res.redirect('/monitoring')
}