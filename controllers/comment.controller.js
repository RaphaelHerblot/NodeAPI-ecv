/* 
Imports
*/
    const Models = require('../models/index');
//

/*  
CRUD methods
*/
    const createOne = req => {
        return new Promise((resolve, reject) => {
            Models.comment.create(req.body)
                .then( async data => {
                    await Models.post.findById( req.body.post )
                        .then( async post => {
                            post.comments.push( data._id );
                            await post.save()
                                .then( commentsPost => {
                                    resolve(commentsPost)
                                })
                                .catch(updateError => reject(updateError))
                        })
                        .catch(err => reject(err))

                    await Models.user.findById( data.author )
                        .then( async user => {
                            user.comments.push( data._id );
                            await user.save()
                                .then(userComments => {
                                    resolve(userComments);
                                })
                                .catch(updateError => reject(updateError));
                        })
                        .catch( err => reject(err));
                    resolve(data) 
                })
                .catch(err => reject(err))
                
        })
    }

    const readAll = () => {
        return new Promise((resolve, reject) => {
            // Mongoose population to get associated data
            Models.comment.find()
                .populate('author', ['-password'])
                .exec((err, data) => {
                    if (err) { return reject(err) }
                    else { return resolve(data) }
                })
        })
    }

    const readOne = id => {
        return new Promise((resolve, reject) => {
            // Mongoose population to get associated data
            Models.comment.findById(id)
                .populate('author', ['-password'])
                .exec((err, data) => {
                    if (err) { return reject(err) }
                    else { return resolve(data) }
                })
        })
    }

    const updateOne = req => {
        return new Promise((resolve, reject) => {
            // Get comment by ID
            Models.comment.findById(req.body.id)
                .then(comment => {
                    // Check author 
                    if (String(comment.author) !== String(req.user._id)) {
                        reject('Author cannot comment his own post')
                    }

                    // Update object
                    comment.content = req.body.content;
                    comment.dateModified = new Date();

                    // Save comment changes
                    comment.save()
                        .then( updatedComment => resolve(updatedComment) )
                        .catch( updateError => reject(updateError) )
                })
                .catch(err => reject(err))
        })
    }

    const deleteOne = req => {
        return new Promise(async (resolve, reject) => {
            // Delete object
            Models.comment.findByIdAndDelete( req.params.id, (err, deleted) => {
               if( err ){ return reject(err) }
               else{
                    console.log("Comment deleted !");
               }
            })
       });
    }

    // Reading all the comment of a single post
    const readAllCommentsOfPost = postId => {
        return new Promise((resolve, reject) => {
            // Mongoose population to get associated data
            Models.comment.find({ post: postId })
                .populate('comment', ['content', 'author'])
                .populate('author', ['-password'])
                .exec((err, data) => {
                    if (err) { 
                        return reject(err) 
                    } else {
                        return resolve(data) 
                    }
                })
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
        readAllCommentsOfPost
    }
//