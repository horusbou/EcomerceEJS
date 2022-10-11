const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/product-list', {
				products,
				path: '/products',
				pageTitle: 'Shop',
			});
		})
		.catch((err) => {
			console.error(err);
		});
};
exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-details', {
				product: product,
				path: '/products',
				pageTitle: `${product.title}`,
			});
		})
		.catch((err) => {
			if (err) throw err;
		});
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				products,
				path: '/',
				pageTitle: 'Shop Index',
			});
		})
		.catch((err) => {
			console.error(err);
		});
};
exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			let products = user.cart.items;
			res.render('shop/cart', {
				products,
				path: '/cart',
				pageTitle: 'Your Cart',
			});
		});
};
exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => res.redirect('/'))
		.catch((err) => console.log(err));
};
exports.postDeleteCartItem = (req, res, next) => {
	const productId = req.body._id;
	req.user
		.deleteCartItem(productId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};
exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			let products = user.cart.items.map((item) => {
				return { quantity: item.quantity, product: { ...item.productId._doc } };
			});
			const order = new Order({
				userId: req.user._id,
				products,
			});
			order.save();
			user.cart.items = [];
			return user.save();
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
	Order.find({ userId: req.user._id })
		.then((data) => {
			console.log(data.products);
			return data;
		})
		.then((orders) => {
			res.render('shop/orders', {
				orders,
				path: '/orders',
				orders,
				pageTitle: 'Orders',
			});
		})
		.catch((err) => console.log(err));
};
exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};
exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then((order) => {
			if (!order) next(new Error(err));
			if (order.userId.toString() !== req.user._id.toString())
				return next(new Error(err));
			const invoiceName = 'invoice-' + orderId + '.pdf';
			const invoicePath = path.join('data', 'invoices', invoiceName);
			createReadStream = require('fs').createReadStream;
			const file = createReadStream(invoicePath);
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader(
				'Content-Disposition',
				'inline; filename="' + invoiceName + '"'
			);
			file.pipe(res);
		})

		.catch((err) => next(new Error(err)));
};
