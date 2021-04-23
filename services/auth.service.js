/* 
Imports
*/
    const JwtStrategy = require('passport-jwt').Strategy; //=> https://www.npmjs.com/package/passport-jwt
    const UserModel = require('../models/user.model');
//

/* 
Methods
*/
    // Extract token from cookie AND from the header
    const cookieExtractor = (req, res) => {
        let token = null;

        // FRONT : if the header authorization is set, the token is set by taking it from there 
        // to authorize the user from POST and UPDATE
        if(typeof req.headers.authorization !== 'undefined') {
            token = (req.headers.authorization).split(" ").pop();
        }

        // BACKOFFICE : Otherwise, the token is set by taking it from the cookies
        else if( req && req.cookies){ 
            token = req.cookies[process.env.COOKIE_NAME] 
        } 
        return token;
    }

    // JWT authentication
    const authJwt = passport => {
        // JWT options for passport
        const opts = {
            jwtFromRequest: cookieExtractor, 
            secretOrKey: process.env.JWT_SECRET
        }

        // JWT strategy
        passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
            UserModel.findOne({ _id: jwtPayload._id }, (err, user) => {
                if (err) { return done(err, false)}
                if (user) { return done(null, user) }
                else { return done(null, false) }
            });
        })); 
    }
//

/* 
Export
*/
    module.exports = {
        setAutentication: (passport) => {
            authJwt(passport)
        }
    }
//