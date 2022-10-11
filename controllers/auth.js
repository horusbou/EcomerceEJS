const crypto = require('crypto');
const { validationResult } = require('express-validator');

const SENDGRID_API_KEY =
	'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';
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
	const message = req.flash('error')[0];
	res.render('auth/login.ejs', {
		pageTitle: 'Login',
		path: '/login',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
		},
		validationsErrors: [],
	});
};
exports.postLogin = (req, res, next) => {
	const { email, password } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).render('auth/login.ejs', {
			pageTitle: 'Login',
			path: '/login',
			errorMessage: errors.array(),
			oldInput: {
				email: email,
				password: password,
			},
			validationsErrors: errors.array(),
		});
	}
	User.findOne({ email })
		.then((user) => {
			if (user) {
				bcryptjs
					.compare(password, user.password)
					.then((userData) => {
						if (userData) {
							req.session.user = user;
							req.session.isLoggedIn = true;
							return req.session.save((err) => {
								if (err) console.log(err);
								req.flash('succses', 'You Logged In');
								res.redirect('/');
							});
						} else {
							req.flash('error', 'invalid E-mail or password.');
							return res.redirect('/login');
						}
					})
					.catch((err) => {
						console.log(err);
						req.flash('error', 'Server Error');
						return res.redirect('/login');
					});
			} else {
				req.flash('error', 'invalid E-mail or password.');
				return res.redirect('/login');
			}
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
exports.postLogOut = (req, res, next) => {
	User.findById(req.session.user._id)
		.then((user) => {
			req.session.destroy(() => {
				res.redirect('/');
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
exports.getSignUp = (req, res, next) => {
	res.render('auth/signup', {
		pageTitle: 'Sign Up',
		path: '/signup',
		errorMessage: req.flash('error')[0],
		oldInput: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationsErrors: [],
	});
};
exports.postSignUp = (req, res, next) => {
	const { email, password, confirmPassword } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(400).render('auth/signup', {
			pageTitle: 'Sign Up',
			path: '/signup',
			errorMessage: errors.array(),
			oldInput: {
				email: email,
				password: password,
				confirmPassword: confirmPassword,
			},
			validationsErrors: errors.array(),
		});
	}
	bcryptjs.hash(password, 12).then((hashPass) => {
		const newUser = new User({
			email,
			password: hashPass,
			cart: { items: [] },
		});
		return newUser.save().then((result) => {
			return sgMail
				.send({
					to: `tahaya4625@gmail.com`,
					from: 'tahaya4625@gmail.com', // Use the email address or domain you verified above
					subject: 'Sending with Twilio SendGrid is Fun',
					text: 'and easy to do anywhere, even with Node.js',
					html: '<strong>and easy to do anywhere, even with Node.js</strong>',
				})
				.then((data) => {
					res.redirect('/login');
				})
				.catch((err) => {
					const error = new Error(err);
					error.httpStatusCode = 500;
					return next(error);
				});
		});
	});
};
exports.getReset = (req, res) => {
	res.render('auth/reset', {
		pageTitle: 'Reset Password',
		path: '/reset',
		errorMessage: req.flash('error')[0],
	});
};
exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash('error', 'Error in Reset Email');
					return res.redirect('/reset');
				}
				let expiredDate = new Date();
				expiredDate.setHours(expiredDate.getHours() + 2);
				user.resetToken = token;
				user.resetTokenExpiration = expiredDate;
				return user.save();
			})
			.then((result) => {
				return sgMail.send({
					to: `tahaya4625@gmail.com`,
					from: 'tahaya4625@gmail.com', // Use the email address or domain you verified above
					subject: 'Password Reset',
					text: 'and easy to do anywhere, even with Node.js',
					html: `<p>you requested A password Resed</p>
                    <p>Click this <a href="http://localhost:3001/reset/${token}">Link</a> to reset your passwrod</p>
                    `,
				});
			})
			.then((result) => res.redirect('/'))
			.catch((err) => {
				const error = new Error(err);
				error.httpStatusCode = 500;
				return next(error);
			});
	});
};
exports.getNewPassword = (req, res) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
	})
		.then((user) => {
			res.render('auth/newPassword', {
				pageTitle: 'Update Password',
				path: '/newPassword',
				errorMessage: req.flash('error')[0],
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postNewPassword = (req, res) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;

	let UserFounded;
	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then((user) => {
			if (!user) return res.redirect('/login');
			UserFounded = user;
			return bcryptjs.hash(newPassword, 12);
		})
		.then((hashedPassword) => {
			UserFounded.password = hashedPassword;
			UserFounded.resetToken = undefined;
			UserFounded.resetTokenExpiration = undefined;
			return UserFounded.save();
		})
		.then((result) => res.redirect('/login'))
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
