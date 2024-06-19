module.exports = fn =>
    //return an anonymous function
     (req, res, next) =>{
        // next function is needed in order to pass the function into it so the error can be handled in the global error handling middleware
    fn(req, res, next).catch(next) //calling the function catch the error when it does not return the promises
    };