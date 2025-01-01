class apierror extends Error{

    constructor(
        statusCode,
        message = "something went wrong"
    ){
        this.statusCode = statusCode,
        this.message = message,
        this.data = null
    }
}

export {apierror}
