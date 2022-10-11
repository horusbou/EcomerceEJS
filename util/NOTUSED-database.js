const { rejects } = require('assert/strict');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		'mongodb+srv://horus:compaq7550@cluster0.zh1hh.mongodb.net/shop?retryWrites=true&w=majority'
	)
		.then((client) => {
			console.log('Connected!');
			_db = client.db();
			callback();
			// return new Promise((resolve, rejects) => {
			// 	resolve(client);
			// });
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};
const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No Db Found';
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', 'compaq7550', {
// 	host: 'localhost',
// 	dialect: 'mysql',
// });
//  module.exports = sequelize;
