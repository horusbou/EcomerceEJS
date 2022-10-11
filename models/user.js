const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	resetToken: { type: String },
	resetTokenExpiration: { type: Date },
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});
userSchema.methods.addToCart = function (product) {
	// const db = getDb();
	const cartProductIndex = this.cart.items.findIndex((cp) => {
		return cp.productId.toString() === product._id.toString();
	});
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];
	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({ productId: product._id, quantity: newQuantity });
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
};
userSchema.methods.deleteCartItem = function (prodId) {
	const updatedCart = this.cart.items.filter(
		(item) => item.productId.toString() !== prodId.toString()
	);
	this.cart.items = updatedCart;
	return this.save();
};
module.exports = mongoose.model('user', userSchema);
// const getDb = require('../util/NOTUSED-database').getDb;
// const { v4: uuid } = require('uuid');

// class User {
// 	constructor(name, email, cart, _id) {
// 		this.email = email;
// 		this.name = name;
// 		this.cart = cart; //{items:[]}
// 		this._id = _id;
// 	}
// 	save() {
// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.insertOne({ _id: uuid(), ...this })
// 			.then((result) => {
// 				console.log(result);
// 				return result;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// 	static findById(userId) {
// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.findOne({ _id: userId })
// 			.then((result) => {
// 				// console.log(result);
// 				return result;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// 	addToCart(product) {
// 		const db = getDb();
// 		const cartProductIndex = this.cart.items.findIndex((cp) => {
// 			return cp.productId === product._id;
// 		});
// 		let newQuantity = 1;
// 		const updatedCartItems = [...this.cart.items];
// 		if (cartProductIndex >= 0) {
// 			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// 			updatedCartItems[cartProductIndex].quantity = newQuantity;
// 		} else {
// 			updatedCartItems.push({ productId: product._id, quantity: newQuantity });
// 		}
// 		const updatedCart = {
// 			items: updatedCartItems,
// 		};
// 		return db
// 			.collection('users')
// 			.updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
// 	}
// 	getUserCart() {
// 		const db = getDb();
// 		// const productIds = this.cart.items.map ;
// 		return db
// 			.collection('users')
// 			.find({ _id: '611b6085c50dc166a35256f3' })
// 			.toArray()
// 			.then((user) => {
// 				return user[0].cart;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// 	deleteCartItem(prodId) {
// const db = getDb();
// let updatedCart = [...this.cart.items];
// updatedCart = updatedCart.filter((item) => item.productId !== prodId);
// return db
// 	.collection('users')
// 	.updateOne({ _id: this._id }, { $set: { cart: { items: updatedCart } } });
// 	}
// 	addOrder() {
// 		const db = getDb();
// 		return db
// 			.collection('orders')
// 			.insertOne({ _id: uuid(), userId: this._id, ...this.cart })
// 			.then((result) => {
// 				this.cart = { items: [] };
// 				return db
// 					.collection('users')
// 					.updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
// 			});
// 	}
// 	getOrders() {
// 		const db = getDb();
// 		return db.collection('orders').find({ userId: this._id }).toArray();
// 	}
// }
// module.exports = User;
