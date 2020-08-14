const express = require('express');
const routes = express.Router();

//Rotas instructors
routes.get('/', (req, res) => {
  return res.render('layout.njk');
});

module.exports = routes;

