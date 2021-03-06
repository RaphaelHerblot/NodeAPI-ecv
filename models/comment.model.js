/*
Import
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
//

/*
Definition
*/
const MySchema = new Schema({
    // Schema.org
    '@context': { type: String, default: 'http://schema.org' },
    '@type': { type: String, default: 'Commentaire' },

    content: String,

    // Associer le profil utilisateur
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'  
    },

    // Associer à un post
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'  
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'like'
    }],
    
    nbLikes : { type: Number, default: 0 },

    // Définir une valeur par défaut
    creationDate: { type: Date, default: new Date() },
    dateModified: { type: Date, default: new Date() },
    isPublished: { type: Boolean, default: false }
})
//

/* 
Export
*/
    module.exports = mongoose.model('comment', MySchema)
//