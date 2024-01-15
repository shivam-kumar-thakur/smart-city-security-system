const asyncHandler=(func)=>async (req,res,next)=>{
    try{

    }
    catch(err)
    {
        console.log("error in asynchadler");
        res.status(err.code || 500).json({
            "success":false,
            message : e.message
        })
    }
}

export default asyncHandler