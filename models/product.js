const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: { type: String, required: true },
	imageURL: { type: String, required: true },
	price: { type: Number, required: true },
	description: { type: String, required: true },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
module.exports = mongoose.model('Product', productSchema);

// const getDb = require('../util/NOTUSED-database').getDb;
// const { v4: uuid } = require('uuid');

// class Product {
// 	constructor({ title, imageURL, price, description, userId }) {
// 		this.title = title;
// 		this.price = price;
// 		this.imageURL = imageURL;
// 		this.description = description;
// 		this.userId = userId;
// 	}
// 	save() {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.insertOne({
// 				_id: uuid(),
// 				...this,
// 			})
// 			.then((result) => console.log(result))
// 			.catch((err) => console.log(err));
// 	}
// 	static fetchAll() {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.find()
// 			.toArray()
// 			.then((product) => {
// 				return product;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// 	static findById(id) {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.find({ _id: id })
// 			.next()
// 			.then((product) => {
// 				return product;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// 	static update(id, updatedData) {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.updateOne({ _id: id }, { $set: updatedData });
// 	}
// 	static destroy(id) {
// 		const db = getDb();
// 		// console.log(id);
// 		return db
// 			.collection('users')
// 			.update(
// 				{},
// 				{ $pull: { 'cart.items': { productId: id } } },
// 				{ multi: true }
// 			)
// 			.then((res) => {
// 				return db.collection('products').deleteOne({ _id: id });
// 			});
// 	}
// }

// // const Product = sequelize.define('product', {
// // 	id: {
// // 		type: Sequelize.STRING,
// // 		allowNull: false,
// // 		primaryKey: true,
// // 	},
// // 	title: {
// // 		type: Sequelize.STRING,
// // 		allowNull: false,
// // 	},
// // 	price: {
// // 		type: Sequelize.DOUBLE,
// // 		allowNull: false,
// // 	},
// // 	imageURL: {
// // 		type: Sequelize.STRING,
// // 		allowNull: false,
// // 	},
// // 	description: {
// // 		type: Sequelize.STRING,
// // 		allowNull: false,
// // 	},
// // });
// module.exports = Product;
