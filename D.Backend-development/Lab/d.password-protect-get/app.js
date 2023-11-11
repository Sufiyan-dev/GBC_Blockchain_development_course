const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// 
app.use(express.urlencoded({extended: true}));

// Session
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./passport-config')(passport)


app.get('/dashboard', ensureAuthenticated, (req,res) => {
    res.send(`Welcome, ${req.user.username}! This is the protected dashboard.`);
});


app.get('/login',(req,res) => {
    res.send('Login page');
});

app.post('/login', passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login'
        })
);

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})