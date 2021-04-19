const url = "http://localhost:3000";

// modal update comment
function openModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = "block";
}

// close modal update comment
function closeModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = "none";
}

// close modal update comment
window.onclick = function (event) {
    let modals = document.getElementsByClassName('modal')
    if (modals) {
        for (let modal of modals) {
            if (modal) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        }
    }
}

function like(action, id) {

    let data = { post: null, comment: null, action };

    switch (action) {
        case 'comment': data.comment = id; break;
        case 'post': data.post = id; break;
        default: return;
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }

    fetch(`${window.location.protocol}//${window.location.host}/api/like/set_like`, options)
        .then(response => response.ok ? response.json() : response)
        .then(data => {
            if (data.err === null) {
                if (action == "comment") {
                    document.getElementById('counterComment' + id).innerHTML = data.data.amountCommentLikes;
                } else if (action == 'post') {
                    document.getElementById('counterPost').innerHTML = data.data.amountPostLikes;
                }
            }
        })
        .catch(error => console.error(error))
}

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
