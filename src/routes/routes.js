const express = require('express');
const routes = express.Router();

//Rotas instructors
routes.get('/', (req, res) => {
  return res.send('Hello World');
});

module.exports = routes;

