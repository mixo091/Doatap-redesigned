const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectFlash = require('connect-flash');
const breadcrumbs = require('express-breadcrumbs');
const path = require('path');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const passport = require('passport');

// require routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

let app = express();

app.use(cookieParser('secret'));
app.use(breadcrumbs.init());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, 'public')))
app.use(connectFlash());
app.use(fileUpload());

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
    response.locals.request = request.session.request
    response.locals.success = request.flash("success")
    response.locals.errors = request.flash("errors")
    response.locals.message = request.session.message
    response.locals.breadcrumbs = request.breadcrumbs()
    next()
})

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRoutes)
app.use("/user-menu", userRoutes)
app.use("/admin", adminRoutes)

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Building a login system with NodeJS is running on port ${port}!`));