require('dotenv').config();
const express = require('express');
const path = require('node:path');
const session = require('express-session');
const pgStore = require('connect-pg-simple')(session);
const passport = require('passport')
require('./config/passport');
const indexRouter = require('./routes/index');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: false,
    store: new pgStore({
        conString: process.env.CONNECTION_STRING,
        createTableIfMissing: true
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath));

app.use('/', indexRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

