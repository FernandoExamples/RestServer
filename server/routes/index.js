const express = require('express');
const app = express();

app.use(require('./user_routes'));
app.use(require('./login_routes'));
app.use(require('./category_routes'));
app.use(require('./product_routes'));

module.exports = app;
