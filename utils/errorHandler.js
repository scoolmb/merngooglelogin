const errorHandler = (error, req, res, next) => {
    console.log(error);
    return res.status(error.statusCode).json({success: false, error:{status:error.statusCode, message: error.message} });
}

module.exports = errorHandler;