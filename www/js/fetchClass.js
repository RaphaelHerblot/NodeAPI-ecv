// Class to re-use the fetch method

class requestAPI {
    constructor(url, requestType, data = null ) {
        this.url = url;
        this.requestType = requestType;
        this.data = data;


        this.requestHeader = {
            method: requestType,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Ajouter les donées dans les requêtes POST, PUT ET DELETE
        if(this.requestType === 'POST' || this.requestType === 'PUT' || this.requestType === 'DELETE') {
            this.requestHeader.body = JSON.stringify(data);
        }
    }

    callAPI() {
        return new Promise( (resolve, reject) => {
            fetch( this.url, this.requestHeader )
            .then( apiResponse => {
                if( apiResponse.ok ) {
                    return apiResponse.json();
                } else {
                    return apiResponse.json()
                    .then( message => reject(message) )
                };
            })
            .then( jsonData => resolve(jsonData))
            .catch( apiError => reject(apiError));
        })
    }
}
