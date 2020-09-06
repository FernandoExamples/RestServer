const express = require('express');
const app = express();

app.use(require('./user_routes'));
app.use(require('./login_routes'));

module.exports = app;
