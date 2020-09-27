class ApiResponse {

    message = String;
    success = Boolean;
    result = Object;


    constructor(message,success,result){
        this.message = message;
        this.success = success;
        this.result = result;
    }

}
module.exports = ApiResponse;
