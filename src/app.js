const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectFlash = require('connect-flash');
const breadcrumbs = require('express-breadcrumbs');
const path = require('path');
const methodOverride = require('method-override');
const passport = require('passport');

// require routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');

let app = express();

app.use(cookieParser('secret'));
app.use(breadcrumbs.init());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, 'public')))
app.use(connectFlash());
// Enable breadcrumbs
app.use(breadcrumbs.setHome({
    name: 'Αρχική',
    url: '/'
}));
//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((request, response, next) => {
    response.locals.loggedin = request.session.loggedin
    response.locals.currentUser = request.session.currentUser
    // response.locals.warning = request.flash("warning")
    // response.locals.danger = request.flash("danger")
    response.locals.success = request.flash("success")
    response.locals.breadcrumbs = request.breadcrumbs()
    next()
})

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRoutes)
app.use("/account", userRoutes)

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Building a login system with NodeJS is running on port ${port}!`));