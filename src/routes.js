const express = require('express');
const routes = express.Router();
const controller = require('./controllers/UserController')


routes.post('/user',controller.createUser);

routes.get('/user',controller.getUsers);

routes.get('/user/validate/:id',controller.validateUser);

routes.get('/user/:id',controller.getUserById);

routes.put('/user/:id',controller.updateUser);

routes.delete('/user/:id',controller.deleteUser);

module.exports = routes;