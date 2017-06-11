/**
 * SigninController
 *
 * @description :: Server-side logic for managing Signins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  'index': function(request,response, next){
    response.render('accounts/signin', {title: 'Signin'});
  },
  'authenticate': function(request,response,next){
    var sha = require('sha.js'),
      sha256 = sha('sha256');
    if(request.body.username && request.body.password){
      var query = User.findOne({username: request.body.username});
      query.then(function (logUser) {
        if(logUser){
          if(sha256.update(request.body.password).digest('hex') == logUser.password) {
            logUser.password = null;
            request.session.user = logUser;
            if(logUser.twitter.key == "a" || logUser.twitter.secret == "b"){
              return response.redirect('/settings');
            }
            else{
              return response.redirect('/dashboard');
            }
          }
          else{
            request.body.password = null;
            return response.render('accounts/signin', {error: "Invalid Credentials!", title: 'Signin'});
          }
        }
        else{
          request.body.password = null;
          return response.render('accounts/signin', {error: "Invalid Account!", title: 'Signin'});
        }
      });
      query.fail(function(error){
        console.log(error);
        request.body.password = null;
        return response.render('accounts/signin', {error: "Unexpected error occurred, Please try-again!", title: 'Signin'});
      });
    }
    else{
      request.body.password = null;
      return response.render('accounts/signin', {error: "All Fields are Required!", title: 'Signin'});
    }
  }
};

