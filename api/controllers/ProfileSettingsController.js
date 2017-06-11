/**
 * ProfileSettingsController
 *
 * @description :: Server-side logic for managing Profilesettings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  'index': function(request,response, next){
    response.render('settings/profileSettings', {title: 'Profile Settings', user: request.session.user});
  },
  'validate': function(request,response,next){
    if(request.body.fname && request.body.lname && request.body.email && request.body.username){
        return next();
    }
    else{
      return response.render('settings/profileSettings', {error: "All Fields are Required!",title: 'Profile Settings', user: request.session.user});
    }
  },
  'validateUsername': function(request,response,next){
    if(request.body.username.length >= 4){
      return next();
    }
    else{
      return response.render('accounts/signup', {error: "Username must be minimum 4 characters!",title: 'Profile Settings', user: request.session.user});
    }
  },
  'checkEmail': function(request,response,next){
    var emailQuery = User.find({email: request.body.email});
    emailQuery.then(function (logUser) {
      if(logUser.length > 1){
        return response.render('settings/profileSettings', {error: "E-Mail Address is already in use!",title: 'Profile Settings', user: request.session.user});
      }
      else{
        return next();
      }
    });
    emailQuery.fail(function(error){
      console.log(error);
      return response.render('settings/profileSettings', {error: "Unexpected error occurred, Please try-again!",title: 'Profile Settings', user: request.session.user});
    });
  },
  'checkUsername': function(request,response,next) {
    var usernameQuery = User.find({username: request.body.username});
    usernameQuery.then(function (logUser) {
      if(logUser.length > 1){
        return response.render('settings/profileSettings', {error: "Username is already in use!",title: 'Profile Settings', user: request.session.user});
      }
      else{
        return next();
      }
    });
    usernameQuery.fail(function(error){
      console.log(error);
      return response.render('settings/profileSettings', {error: "Unexpected error occurred, Please try-again!",title: 'Profile Settings', user: request.session.user});
    });
  },
  'updateAccount': function(request,response,next){
    var createQuery = User.update({id: request.session.user.id},{
      name: {
        first: request.body.fname,
        last: request.body.lname
      },
      email: request.body.email,
      username: request.body.username
    });
    createQuery.then(function(User){
      request.session.user.name = {first: request.body.fname, last: request.body.lname};
      request.session.user.email = request.body.email;
      request.session.user.username = request.body.username;
      return response.render('settings/profileSettings', {success: "Profile updated successfully!",title: 'Profile Settings', user: request.session.user});
    });
    createQuery.fail(function(error){
      console.log(error);
      return response.render('settings/profileSettings', {error: "Unexpected error occurred, Please try-again!",title: 'Profile Settings', user: request.session.user});
    })
  }
};

