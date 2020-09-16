const express = require('express');
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');

/*=================USERS============= */
// //Login and Logout
// routes.get('/login', SessionController.loginForm);
// routes.post('/login', SessionController.login);
// routes.post('/logout', SessionController.logout);

// //Reset password / forgot
// routes.get('/forgot-password', SessionController.forgotForm);
// routes.get('/password-reset', SessionController.resetForm);
// routes.post('/login', SessionController.forgot);
// routes.post('/password-reset', SessionController.reset);

// //User Register *UserController
routes.get('/register', UserController.registerForm);
// routes.get('/', UserController.show);
// routes.post('/register', UserController.post);
// routes.put('/', UserController.update);
// routes.delete('/', UserController.delete);
// 
module.exports = routes;