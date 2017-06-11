/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  'index': function(request,response, next){
    return response.render('settings/twitterSettings', {title: 'Settings', user: request.session.user});
  }
};

