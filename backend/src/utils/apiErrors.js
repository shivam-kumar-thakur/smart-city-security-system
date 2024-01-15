class ApiError extends Error
{
    constructor(
        statuscode,
        messsage="API Error Ocurred",
        errors=[],
        stack=""
    )
    {
        super(messsage);
        this.statuscode=statuscode;
        this.message=messsage;
        this.errors=errors;
        this.success=false;
        this.data=null;

        if(stack){
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}