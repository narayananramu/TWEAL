/**
 * SecuritySettingsController
 *
 * @description :: Server-side logic for managing Securitysettings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sha = require('sha.js'),
  sha256 = sha('sha256');
module.exports = {
  'index': function(request,response, next){
    return response.render('settings/securitySettings', {title: 'Profile Settings'});
  },
  'validatePassword': function(request,response,next){
    if(request.body.opassword && request.body.newpassword && request.body.rnewpassword){
      if(request.body.opassword.length >= 6 && request.body.newpassword.length >= 6 && request.body.rnewpassword.length >= 6){
        if(request.body.newpassword == request.body.rnewpassword){
          return next();
        }
        else{
          return response.render('settings/securitySettings', {error: "New Password does not match!", title: 'Security Settings'});
        }
      }
      else{
        return response.render('settings/securitySettings', {error: "Password must be minimum 6 characters!", title: 'Security Settings'});
      }
    }
    else{
      return response.render('settings/securitySettings', {error: "All Fields are Required!", title: 'Security Settings'});
    }
  },
  'updatePassword': function(request,response,next){
    var createQuery = User.update({id: request.session.user.id},{
      password: sha256.update(request.body.newpassword).digest('hex')
    });
    createQuery.then(function(logUser){
      return response.render('settings/securitySettings', {success: "Password updated successfully!",title: 'Security Settings', user: request.session.user});
    });
    createQuery.fail(function(error){
      console.log(error);
      return response.render('settings/securitySettings', {error: "Unexpected error occurred, Please try-again!",title: 'Security Settings', user: request.session.user});
    })
  }
};

