/**
 * DashboardController
 *
 * @description :: Server-side logic for managing Dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  'index': function(request,response, next){
    return response.render('dashboard/dashboard', {title: 'Dashboard'});
  },
  'logout': function(request,response,next){
    request.session.user = null;
    return response.redirect('/signin');
  }
};

