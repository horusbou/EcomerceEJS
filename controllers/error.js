exports.get404 = (req, res, next) => {
	res.status(404).render('404.ejs', {
		pageTitle: '404| Page Not Found',
		path: '/error',
		isAuthenticated: req.isLoggedIn,
	});
};
exports.get500 = (req, res, next) => {
	res.status(500).render('500.ejs', {
		pageTitle: '500| Error',
		path: '/500',
		isAuthenticated: req.isLoggedIn,
	});
};
