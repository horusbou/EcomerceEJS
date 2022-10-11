const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    edit: false,
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    errorMessage: '',
  });
};
exports.postAddProducts = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      edit: false,
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      errorMessage: 'Attached file is not an image',
    });
  }

  const imageURL = image.path;
  const product = new Product({
    title: title.trim(),
    price: price.trim(),
    imageURL,
    description: description.trim(),
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) return res.redirect('/');
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        edit: true,
        errorMessage: '',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postEditProduct = (req, res, next) => {
  const { _id, ...editedProduct } = req.body;
  const image = req.file;
  Product.findById(_id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = editedProduct.title;
      product.description = editedProduct.description;
      product.price = editedProduct.price;
      if (image) {
        product.imageURL = image.path;
      }
      return product.save().then((result) => {
        res.redirect('/products');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((products) => {
    res.render('admin/products', {
      products: products,
      path: '/admin/products',
      pageTitle: 'Admin Products',
    });
  });
};
exports.DeleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.body._id, userId: req.user._id })
    .then((data) => {
      return res.redirect('/products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
