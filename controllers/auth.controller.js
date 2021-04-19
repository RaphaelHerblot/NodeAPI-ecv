/*
Imports
*/
    const Models = require('../models/index');
    const bcrypt = require('bcryptjs');
//

/*
Controller methods
*/
    const register = (req, res) => {
        return new Promise( async (resolve, reject) => {
            // Checking if the user is already known by its email
            const userAlreadyKnown = await Models.user.exists({ 
                email: req.body.email 
            })

            // If the user doesn't exist we can create it and encryt its data
            if ( !userAlreadyKnown ) {
                // Encrypt yser password
                req.body.password = await bcrypt.hash( req.body.password, 10 );

                // Encrypt RGPD data
                try {
                    const newUser = await Models.user.create(req.body);
                    const userJwt = newUser.generateJwt(newUser);
                    res.cookie( process.env.COOKIE_NAME, userJwt, { maxAge: 700000, httpOnly: true } );
                    return resolve(newUser);
                } catch (error) {
                    return reject("Error : ", error);
                }
            } else {
                return reject('This email is already existing');
            }
        })
    }

    const login = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Find user from email
            Models.user.findOne( { email: req.body.email }, (err, data) => {
                if( err || data === null ) { 
                    return reject('This email doesnt exist, try something else'); 
                } else {
                    // Check user password
                    const validatedPassword = bcrypt.compareSync( req.body.password, data.password );
                    if( !validatedPassword ) { 
                        return reject('Invalid password');
                    } else {
                        // Generate user JWT
                        const userJwt = data.generateJwt(data);

                        // Set response cookie
                        res.cookie( process.env.COOKIE_NAME, userJwt, { 
                            maxAge: 700000, httpOnly: true 
                        });

                        // Send user data
                        return resolve(data);
                    };
                }
            })
        })
    }

    const logout = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Set response cookie
            res.cookie.set( process.env.COOKIE_NAME, userJwt, { 
                expires: Date.now() 
            })

            return resolve(true);
        })
    }
//

/*
Export controller methods
*/
    module.exports = {
        register,
        login,
        logout
    }
//
