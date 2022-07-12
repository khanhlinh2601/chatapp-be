const passport = require('passport');
const User = require('./app/models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = "950178363990-qijglitpqsep49a53537geecmjbu7fe8.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      if(profile.id){
        User.findOne({googleId: profile.id})
            .then(data => {
                if(data){
                    var user = {
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name:  profile.name.familyName + ' ' + profile.name.givenName
                    }
                    return done(null, user)
                }else{
                    new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.name.familyName + ' ' + profile.name.givenName
                    })
                    .save()
                    .then(user=>done(null, user))
                }
            })
      }
  }
));

passport.serializeUser(function(user, done){
    done(null, user)
})
passport.deserializeUser(function(user, done){
    done(null, user)
})