const express = require('express');
const { validationResult, check } = require('express-validator');
const authRoutes = require('../controllers/auth');
const User = require('../models/user');

const routes = express.Router();

routes.get('/login', authRoutes.getLogin);
routes.post(
	'/login',
	check('email').isEmail().withMessage('Invalid Email'),
	check('password')
		.isLength({ min: 5 })
		.withMessage('must be at least 5 chars long'),
	authRoutes.postLogin
);
routes.post('/logout', authRoutes.postLogOut);
routes.get('/signup', authRoutes.getSignUp);
routes.post(
	'/signup',
	check('email')
		.isEmail()
		.withMessage('Please enter a valid Email')
		.custom((value, { req }) => {
			return User.findOne({ email: value }).then((user) => {
				if (user)
					return Promise.reject(
						'Email Exist already. please pick a diffrent one.'
					);
			});
		})
		.normalizeEmail(),
	check('password')
		.isLength({ min: 5 })
		.withMessage('must be at least 5 chars long')
		.trim(),
	check('confirmPassword')
		.trim()
		.custom((value, { req }) => {
			if (value !== req.body.password)
				throw new Error('Passwords must be same');
			return true;
		}),
	authRoutes.postSignUp
);
routes.get('/reset', authRoutes.getReset);
routes.post('/reset', authRoutes.postReset);
routes.get('/reset/:token', authRoutes.getNewPassword);
routes.post('/newPassword', authRoutes.postNewPassword);
module.exports = routes;
