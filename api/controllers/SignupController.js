/**
 * SignupController
 *
 * @description :: Server-side logic for managing Signups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sha = require('sha.js'),
  sha256 = sha('sha256');
module.exports = {
  'index': function(request,response, next){
    response.render('accounts/signup', {title: 'Signup'});
  },
  'validatePassword': function(request,response,next){
    if(request.body.fname && request.body.lname && request.body.email && request.body.username && request.body.password){
      if(request.body.password.length >= 6){
        return next();
      }
      else{
        return response.render('accounts/signup', {error: "Password must be minimum 6 characters!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
      }
    }
    else{
      return response.render('accounts/signup', {error: "All Fields are Required!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
    }
  },
  'validateUsername': function(request,response,next){
    if(request.body.username.length >= 4){
      return next();
    }
    else{
      return response.render('accounts/signup', {error: "Username must be minimum 4 characters!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
    }
  },
  'checkEmail': function(request,response,next){
    var emailQuery = User.findOne({email: request.body.email});
    emailQuery.then(function (User) {
      if(User){
        return response.render('accounts/signup', {error: "E-Mail Address is already in use!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
      }
      else{
        return next();
      }
    });
    emailQuery.fail(function(error){
      console.log(error);
      return response.render('accounts/signup', {error: "Unexpected error occurred, Please try-again!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
    });
  },
  'checkUsername': function(request,response,next) {
    var usernameQuery = User.findOne({username: request.body.username});
    usernameQuery.then(function (User) {
      if(User){
        return response.render('accounts/signup', {error: "Username is already in use!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
      }
      else{
        return next();
      }
    });
    usernameQuery.fail(function(error){
      console.log(error);
      return response.render('accounts/signup', {error: "Unexpected error occurred, Please try-again!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
    });
  },
  'createAccount': function(request,response,next){
    var createQuery = User.create({
      name: {
        first: request.body.fname,
        last: request.body.lname
      },
      email: request.body.email,
      username: request.body.username,
      password: sha256.update(request.body.password).digest('hex'),
      role: {
        id: 0,
        name: "Super Admin"
      },
      twitter: {
        key: "a",
        secret: "b",
        searchTerm: "twealco"
      }
    });
    createQuery.then(function(User){
      return response.redirect('/signin');
    });
    createQuery.fail(function(error){
      console.log(error);
      return response.render('accounts/signup', {error: "Unexpected error occurred, Please try-again!", fname: request.body.fname, lname: request.body.lname, email: request.body.email, username: request.body.username, title: 'Signup'});
    })
  }
};

