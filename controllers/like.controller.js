/* 
Imports
*/
const Models = require('../models/index');
//

/*  
CRUD methods
*/  
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            Models.like.create( req.body )
            .then( async data => {
                // Add a new like for a post
                if ( data.post != null ) {
                    await Models.post.findById( req.body.post )
                        .then( async post => {
                            post.likes.push( data._id );
                            await post.save()
                                .then( likedPost => {
                                    resolve(likedPost)
                                })
                                .catch(updateError => reject(updateError))
                        })
                        .catch(err => reject(err))
                }
                // Add a new like for a comment
                else {
                    await Models.comment.findById( data.comment )
                        .then( async comment => {
                            comment.likes.push( data._id );
                            await comment.save()
                                .then( likedComment => {
                                    resolve( likedComment );
                                })
                                .catch(updateError => reject(updateError));
                        })
                        .catch( err => reject(err));
                }
                // Adding likes to the user
                await Models.user.findById( data.author )
                    .then( async user => {
                        user.likes.push( data._id );
                        await user.save()
                            .then(userLikes => {
                                resolve(userLikes);
                            })
                            .catch(updateError => reject(updateError));
                    })
                    .catch( err => reject(err));

                resolve(data) 
            })
            .catch( err => reject(err) )
        })
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.like.find()
                .populate('like', ['author'])
                .exec( (err, data) => {
                    if( err ) { return reject(err) }
                    else { return resolve(data) }
                });
        })
    }

    const readOne = id => {
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.like.findById( id )
                .populate('like', ['author'])
                .exec( (err, data) => {
                    if( err ) { return reject(err); }
                    else { return resolve(data); }
                });
        })
    }

    const updateOne = req => {
        return new Promise((resolve, reject) => {
            // Get like by ID
            Models.like.findById(req.params.id)
                .then(like => {
                    if (like.author !== req.user._id) { 
                        return reject('User not authorized') 
                    }

                    // Update object
                    like.dateModified = new Date();

                    // Save like changes
                    like.save()
                        .then(
                            updatedlike => resolve(updatedlike)
                        )
                        .catch(
                            updateError => reject(updateError)
                        );
                })
                .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise(async (resolve, reject) => {
            // Get Like by ID
            Models.like.findByIdAndDelete(req._id)
                .then( async () => {
                    // Deleting like for a post
                    if(req.post != null) {
                        await Models.post.findById(req.post)
                            .then(post => {
                                post.likes.splice(req._id);
                                post.save()
                                    .then(updatedPost => {
                                        resolve(updatedPost);
                                    })
                                    .catch(updateError => reject(updateError))
                            })
                            .catch(err => reject(err))
                    }

                    // Deleting like for a comment
                    else {
                        await Models.comment.findById(req.comment)
                            .then(comment => {
                                comment.likes.splice(req._id);
                                comment.save()
                                    .then(likedComment => {
                                        resolve(likedComment);
                                    })
                                    .catch(updateError => reject(updateError))
                            })
                            .catch(err => reject(err))
                    }
                    // Deleting like of the user
                    await Models.user.findById(req.author)
                            .then(user => {
                                user.likes.splice(req._id);
                                user.save()
                                    .then(userLikes => {
                                        resolve(userLikes);
                                    })
                                    .catch(updateError => reject(updateError))
                            })
                            .catch(err => reject(err))
                    resolve(req)

                })
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
    }

    // Getting all the likes of a post
    const readAllLikesOfPost = (postId) => {
        return new Promise( (resolve, reject) => {
            Models.like.find({ 
                    post: postId
                })
                .exec( (err, data) => {
                    if( err ) { return reject(err) }
                    else { return resolve(data) }
                })
        })
    }

    // Getting one like of a post
    const readOneLikeOfPost = req => {
        return new Promise( (resolve, reject) => {
            Models.like.find({ 
                    post: req.body.post, 
                    author: req.body.author 
                })
                .exec( (err, data) => {
                    if( err ) { return reject(err) }
                    else { return resolve(data) }
                });
        })
    }

    // Getting all the likes of a comment
    const readAllLikesOfComment = id => {
        return new Promise( (resolve, reject) => {
            Models.like.find({ comment: id })
                .exec( (err, data) => {
                    if( err ) { return reject(err) }
                    else { return resolve(data) }
                });
        })
    }

    // Getting one like of a comment
    const readOneLikeOfComment = (req) => {
        return new Promise( (resolve, reject) => {
            Models.like.find({ 
                    comment: req.body.comment, 
                    author: req.body.author 
                })
                .exec( (err, data) => {
                    if( err ) { return reject(err); }
                    else { return resolve(data); }
                });
        })
    }

//

/* 
Export controller methods
*/
    module.exports = {
        readAll,
        readOne,
        createOne,
        updateOne,
        deleteOne,
        readAllLikesOfPost,
        readOneLikeOfPost,
        readAllLikesOfComment,
        readOneLikeOfComment
    }
//