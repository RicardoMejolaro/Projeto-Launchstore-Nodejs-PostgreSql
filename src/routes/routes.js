const express = require('express');
const routes = express.Router();

const ProductController = require('../app/controllers/ProductController');


routes.get('/', (req, res) => {
  return res.render('layout.njk');
});

routes.get('/ads/create', (req, res) => {
  return res.redirect('/products/create');
});

routes.get('/products/create', ProductController.create);





module.exports = routes;

