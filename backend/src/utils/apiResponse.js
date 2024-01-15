class ApiResponse
{
    constructor(
        statuscode,
        message="",
        data
    )
    {
        this.message=message;
        this.statuscode=statuscode;
        this.data=data;
        this.success=statuscode<400;
    }
}

export {ApiResponse}