const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const route = express.Router();
const {User, Event, Cart} = require('../model');
const user = new User();
const event = new Event();
const cart = new Cart();

route.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../view/index.html'));
})

// ===USERS===
route.post('/login', bodyParser.json(), (req, res) => {
    user.login(req, res);
})

route.get('/users', (req, res) => {
    user.fetchUsers(req, res);
})

route.put('/user/:id', bodyParser.json(), (req, res) => {
    user.updateUser(req, res);
})

route.post('/register', bodyParser.json(), (req, res) => {
    user.createUser(req, res);
})

route.delete('/user/:id', (req, res) => {
    user.deleteUser(req, res);
})

// ===EVENTS===
route.get('/events', (req, res) => {
    event.fetchEvents(req, res);
})

route.get('/event/:id', (req, res) => {
    event.fetchEvent(req, res);
})

route.post('/event', bodyParser.json(), (req, res) => {
    event.addEvent(req, res);
})

route.put('/event/:id', bodyParser.json(), (req, res) => {
    event.updateEvent(req, res);
})

route.delete('/event/:id', (req, res) => {
    event.deleteEvent(req, res);
})


// ===CART===
route.get('/user/:id/carts', (req, res) => {
    cart.fetchCart(req, res);
})

route.post('/user/:id/cart', bodyParser.json(), (req, res) => {
    cart.addToCart(req, res);
})

route.put('/user/:id/cart/:id', bodyParser.json(), (req, res) => {
    cart.updateItemFromCart(req, res);
})

route.delete('/user/:id/cart', (req, res) => {
    cart.deleteFromCart(req, res);
})

route.delete('/user/:id/cart/:id', (req, res) => {
    cart.deleteItemFromCart(req, res);
})
module.exports = route; 