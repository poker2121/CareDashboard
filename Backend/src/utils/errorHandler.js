// ResError class for error handling
// extend from built in Error class
export class ResError extends Error{
    constructor(message , statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

///// general try & catch for all functions
export const asyncErrorHandler =(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next)
        .catch((error)=>{
            // console.log(error)
            return next(new ResError(error))
        })
    }
}

//////// global error handling "act as error middleware"
export const globalErrorHandling = (err,req,res,next)=>{
    if(err){
        let code = err.statusCode || 500
        if(process.env.Mood=='dev'){
            // error in development phase
            return res.status(code).json({message:err.message,err, stack:err.stack})
        }
        // error in production phase
        return res.status(code).json({message:err.message})
    }
}