

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Actual Response data
 */

export const sendSuccess =(res, statusCode = 200 , message = 'Success', data=null)=>{

  const response ={
    success: true,
    message,
  };

  if(data !== null){
    response.data = data;
  }
 
  return res.status(statusCode).json(response);
};


/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} error - Actual Error details but can be shown only in development phase not in Production phase
 */

export const sendError =(res , statusCode = 500, message = 'Internal Server Error', error = null)=>{
  
  const response ={
    success: false ,
    message
  };

  if(error !== null && process.env.NODE_ENV === 'development'){
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

