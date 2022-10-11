const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const routes = express.Router();

// // Get /admin
routes.get('/add-product', isAuth, adminController.getAddProducts);
routes.post('/add-product', isAuth, adminController.postAddProducts);

routes.get('/products', isAuth, adminController.getProducts);

routes.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
routes.post('/edit-product', isAuth, adminController.postEditProduct);
routes.post('/delete-product', isAuth, adminController.DeleteProduct);
module.exports = routes;
