const url = "http://localhost:3000";

function likePost(postId, userId) {
    new requestAPI(`/api/like/like-post`, 'POST', {
        author: userId,
        post: postId
    })
    .callAPI()
    .then( fetchData => {
        console.log(fetchData);
        numberLikesPost(postId);
    })
    .catch( error => {
        console.log( error.message );
    })
}

function likeComment(commentId, userId) {
    new requestAPI(`/api/like/like-comment`, 'POST', {
        author: userId,
        comment: commentId
    })
    .callAPI()
    .then( fetchData => {
        console.log(fetchData);
        numberLikesComment(commentId);
    })
    .catch( error => {
        console.log( error.message );
    })
}

function numberLikesPost(postId) {  
    new requestAPI(`/api/like/post/${postId}`, 'GET', {
    })
    .callAPI()
    .then( fetchData => {
        document.querySelector('.amountLikesPost').innerHTML = fetchData.data.length.toString();
    })
    .catch( error => {
        console.log( error.message );
    })
}

function numberLikesComment(commentId) {  
    new requestAPI(`/api/like/comment/${commentId}`, 'GET', {
    })
    .callAPI()  
    .then( fetchData => {
        document.querySelector(`.amountLikesComment_${commentId}`).innerHTML = fetchData.data.length.toString();
    })
    .catch( error => {
        console.log( error.message );
    })
}

function deleteComment(commentId) { 
    new requestAPI(`/api/comment/${commentId}`, 'DELETE', {
    })
    .callAPI()  
    .then( fetchData => {
        console.log(fetchData);
    })
    .catch( error => {
        console.log("HELLO");
        console.log( error.message );
    })
    document.querySelector(`.comment-container-${commentId}`).remove();
}
