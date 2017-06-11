module.exports = function(request,response, next){
  if (!request.isSocket) {
    return response.badRequest();
  }
  else{
    next();
  }
};
