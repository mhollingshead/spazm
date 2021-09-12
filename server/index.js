const express = require('express');
const cors = require('cors');
const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
const PORT = process.env.PORT || 8080;
require('dotenv').config();

let _user = {};

// Server
const app = express();

// Middleware
app.use( cors() );
app.use( express.json() );
app.use( passport.initialize() );

// Passport
passport.serializeUser( (user, cb) => cb(null, user) );
passport.deserializeUser( (user, cb) => cb(null, user) );

passport.use( new TwitchStrategy( {
    clientID: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    callbackURL: '/auth/twitch/callback',
    scope: 'user:read:email user:read:follows',
    passReqToCallback : true
}, (req, accessToken, refreshToken, profile, done) => {
    _user = {...profile, accessToken};
    return done(null, accessToken, profile)
} ) );

// Routes
app.get( '/user', (req, res) => res.json(_user) );
app.get( '/auth/logout', (req, res) => { _user = {}; res.send("Logged out!") } )
app.get( '/auth/twitch', passport.authenticate('twitch') );
app.get( '/auth/twitch/callback', passport.authenticate( 'twitch' ), (req, res) => res.redirect('/') );

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));