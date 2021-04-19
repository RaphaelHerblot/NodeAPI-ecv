    /*
Imports
*/
    // Node
    const express = require('express');

// Inner
    const { checkFields } = require('../services/request.service');
    const Mandatory = require('../services/mandatory.service');
    const { sendApiSuccessResponse,sendApiErrorResponse } = require('../services/response.service')

    // Import controllers
    const Controllers = require('../controllers/index')
//

/*
Routes definition
*/
    class ApiRouter {
        // Include Passport authentication service from server file in the RouterClass
        constructor( { passport } ){
            this.router = express.Router(); 
            this.passport = passport
        }

        routes(){
            // [CRUD] define route to read all objects
            this.router.get('/:endpoint', (req, res) => {
                // Use the controller to get data
                Controllers[req.params.endpoint].readAll()
                .then( apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed') )
                .catch( apiError => sendApiErrorResponse(res, res, apiError, 'Request failed') );
            })
 
            // [CRUD] define route to read one object
            this.router.get('/:endpoint/:id', (req, res) => {
                // Use the controller to get data
                Controllers[req.params.endpoint].readOne(req.params.id)
                .then( apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed') )
                .catch( apiError => sendApiErrorResponse(res, res, apiError, 'Request failed') );
            })

            // [CRUD] define route to update one object, protected by Passport MiddleWare
            this.router.put('/:endpoint/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendApiErrorResponse(req, res, null, 'No data provided in the reqest body')
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory[req.params.endpoint], req.body );

                    // Error: bad fields provided
                    if( !ok ){  return sendApiErrorResponse(req, res, { extra, miss }, 'Bad fields provided') }
                    else{
                        // Use the controller to update data
                        Controllers[req.params.endpoint].updateOne(req)
                        .then( apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed') )
                        .catch( apiError => sendApiErrorResponse(res, res, apiError, 'Request failed') );
                    }
                }
            })

            // [CRUD] define route to delete one object, protected by Passport MiddleWare
            this.router.delete('/:endpoint/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Use the controller to delete data
                Controllers[req.params.endpoint].deleteOne(req)
                .then( apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed') )
                .catch( apiError => sendApiErrorResponse(res, res, apiError, 'Request failed') );
            })

            // [CRUD] Route to get the likes from a Post
            this.router.get('/:endpoint/:option/:id', this.passport.authenticate('jwt', { session: false, failureRedirect: '/' }), (req, res) => {
                
                if(req.params.option == "post") {
                    Controllers[req.params.endpoint].readAllLikesOfPost(req.params.id)
                    .then( apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed') )
                    .catch( apiError => sendApiErrorResponse(res, res, apiError, 'Request failed') );
                } else if(req.params.option == "comment") {
                    Controllers[req.params.endpoint].readAllLikesOfComment(req.params.id)
                    .then( apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed') )
                    .catch( apiError => sendApiErrorResponse(res, res, apiError, 'Request failed') );
                } else {
                    console.log("Wrong option");
                }
                // Use the controller to get data
            })

            // [CRUD] define route to create object, protected by Passport MiddleWare
            this.router.post('/:endpoint/:option', this.passport.authenticate('jwt', { session: false, failureRedirect: '/' }), (req, res) => {

                // Check body data
                if (typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0) {
                    return sendApiErrorResponse(res, res, 'Request body is empty', 'Request failed')
                }
                else {
                    // Check body data
                    const { ok, extra, miss } = checkFields(Mandatory[req.params.endpoint], req.body);

                    // Error: bad fields provided (except for deletion)
                    if (!ok && req.params.action != 'delete') {
                        return sendApiErrorResponse('error', `/${req.params.endpoint}`, 'POST', res, 'Bad fields provided', { extra, miss });
                    } else {
                        // Add author _id
                        req.body.author = req.user._id;

                        if(req.params.option == "like-post") {
                            console.log("HAY : ", req.body);
                            Controllers[req.params.endpoint].readOneLikeOfPost(req)
                            .then(async data => {
                                // create like
                                if (data.length == 0) {
                                    await Controllers[req.params.endpoint].createOne(req)
                                        .then(apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed'))
                                        .catch(apiError => sendApiErrorResponse(res, res, apiError, 'Request failed'))
                                }
                                // Delete like
                                else {
                                    await Controllers[req.params.endpoint].deleteOne(data[0])
                                        .then(apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed'))
                                        .catch(apiError => sendApiErrorResponse(res, res, apiError, 'Request failed'))
                                }
                            })
                            .catch(apiError => sendApiErrorResponse(res, res, apiError, 'Request failed'));

                        } else if(req.params.option == "like-comment") {
                            console.log("BJR A TOUSSSSSS");
                            console.log("HAY : ", req.body);

                            Controllers[req.params.endpoint].readOneLikeOfComment(req)
                            .then(async data => {
                                // create like
                                if (data.length == 0) {
                                    await Controllers[req.params.endpoint].createOne(req)
                                        .then(apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed'))
                                        .catch(apiError => sendApiErrorResponse(res, res, apiError, 'Request failed'))
                                }
                                // Delete like
                                else {
                                    await Controllers[req.params.endpoint].deleteOne(data[0])
                                        .then(apiResponse => sendApiSuccessResponse(req, res, apiResponse, 'Request succeed'))
                                        .catch(apiError => sendApiErrorResponse(res, res, apiError, 'Request failed'))
                                }
                            })
                            .catch(apiError => sendApiErrorResponse(res, res, apiError, 'Request failed'));

                        } else {
                            console.log("Error on route");
                        }
                    }
                }
            })
        }

        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return this.router;
        };
    }
//

/*
Export
*/
    module.exports = ApiRouter;
//