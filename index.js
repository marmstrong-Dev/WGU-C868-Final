const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const dbcon = require('./Controllers/db_con');
const routes = require('./router');

// Environment Variables
dotenv.config();

// Middleware
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, './Views'));
app.use('/static', express.static(path.join(__dirname, 'Public')));
app.set('view engine', 'ejs');

// Routes Declaration
app.use('/', routes);

// Server Init
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Started on Port: ${ port }`);
});
