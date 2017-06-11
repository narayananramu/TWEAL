/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  '/': {
    controller: 'Signin',
    action: 'index'
  },
  'GET /signin': {
    controller: 'Signin',
    action: 'index'
  },
  'POST /signin': {
    controller: 'Signin',
    action: 'authenticate'
  },
  'POST /signup': ['Signup.validatePassword','Signup.validateUsername','Signup.checkEmail','Signup.checkUsername','Signup.createAccount'],
  'GET /signup': {
    controller: 'Signup',
    action: 'index'
  },
  'GET /settings':{
    controller: 'Settings',
    action: 'index'
  },
  'GET /settings/twitter':{
    controller: 'TwitterSettings',
    action: 'index'
  },
  'GET /settings/twitter/go':{
    controller: 'TwitterSettings',
    action: 'getAccessUrl'
  },
  'GET /settings/twitter/authorise':{
    controller: 'TwitterSettings',
    action: 'authoriseTwitter'
  },
  'POST /settings/twitter/updateSearchTerm':{
    controller: 'TwitterSettings',
    action: 'updateSearchTerm'
  },
  'GET /settings/profile':{
    controller: 'ProfileSettings',
    action: 'index'
  },
  'POST /settings/profile/updateProfile':['ProfileSettings.validate','ProfileSettings.validateUsername','ProfileSettings.checkEmail','ProfileSettings.checkUsername','ProfileSettings.updateAccount'],
  'GET /settings/security':{
    controller: 'SecuritySettings',
    action: 'index'
  },
  'POST /settings/security/updatePassword':['SecuritySettings.validatePassword','SecuritySettings.updatePassword'],
  'GET /tweets': {
    controller: 'Tweets',
    action: 'index'
  },
  'GET /tweets/join': {
    controller: 'TweetsSocket',
    action: 'join'
  },
  'GET /tweets/disconnect': {
    controller: 'TweetsSocket',
    action: 'disconnectLive'
  },
  'GET /tweets/search': {
    controller: 'Tweets',
    action: 'tweetSearch'
  },
  'GET /searchTweets/join': {
    controller: 'TweetsSocket',
    action: 'joinSearch'
  },
  'GET /tweets/depth': {
    controller: 'DepthAnalytics',
    action: 'index'
  },
  'POST /tweets/depthPerform': {
    controller: 'DepthAnalytics',
    action: 'depth'
  },
  'GET /dashboard':{
    controller: 'Dashboard',
    action: 'index'
  },
  'GET /logout':{
    controller: 'Dashboard',
    action: 'logout'
  }

};
