module.exports = function(request,response, next){
  if(typeof request.session.user == "undefined" || request.session.user == null){
    return response.redirect('/signin');
  }
  else{
    return next();
  }
};
