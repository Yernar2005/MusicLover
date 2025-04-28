const ApiError = require("../exceptions/api-error");

module.exports =  (...allowed) => (req, _res, next) =>{
    if(!req.user){
        return next(ApiError.UnauthorizedError());
    }

    if(!allowed.includes(req.user.role)){
        return next(ApiError.ForbiddenError(`Require role ${allowed.join(' or ')}`));
    }

    next();

}