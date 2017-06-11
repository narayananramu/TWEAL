/**
 * TwitterSettingsController
 *
 * @description :: Server-side logic for managing Twittersettings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var OAuth = require('oauth').OAuth, oauth = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "zV8Ak9heBZMSE6Xqu34J1d13l",
  "ixCAhv8lqojuHQESE7JpGvGOAQMcfDeT4owVe75l1tLLwWsUqD",
  "1.0",
  "",
  "HMAC-SHA1");

module.exports = {
  'index': function (req,res, next) {
    return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user});
  },
  'getAccessUrl': function(req,res,next){
    oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
      if (error) {
        console.log(error);
        return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, error: "Authentication Failed!"});
      }
      else {
        req.session.oauth = { token: oauth_token, token_secret: oauth_token_secret};
        return res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
      }
    });
  },
  'authoriseTwitter':function(req,res,next){
    if (req.session.oauth) {
      req.session.oauth.verifier = req.query.oauth_verifier;
      var oauth_data = req.session.oauth;
      oauth.getOAuthAccessToken(oauth_data.token, oauth_data.token_secret, oauth_data.verifier, function(error, oauth_access_token, oauth_access_token_secret, results) {
          if (error) {
            return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, error: "You did not Authorise the Application, please try-again!"});
          }
          else {
            req.session.user.twitter = {key: oauth_access_token, secret: oauth_access_token_secret, searchTerm: req.session.user.twitter.searchTerm};
            var updateQuery = User.update({id: req.session.user.id}, {twitter: req.session.user.twitter});
            updateQuery.then(function(ms){
              delete req.session.oauth;
              return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, success: 'Successfully Authenticated'});
            });
            updateQuery.fail(function(error){
              req.session.user.twitter = {
                key: "a",
                secret: "b",
                searchTerm: req.session.user.twitter.searchTerm
              };
              console.log(error);
              return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, error: "Unable to update the database, please try-again!"});
            })
          }
        }
      );
    }
    else {
      return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, error: "Authentication Failed, please try-again!"});
    }
  },
  'updateSearchTerm': function (req,res,next) {
    if(req.body.searchTerm){
      req.session.user.twitter['searchTerm']= req.body.searchTerm;
      var updateQuery = User.update({id: req.session.user.id}, {twitter: req.session.user.twitter});
      updateQuery.then(function(result){
        req.session.user.twitter = {
          key: req.session.user.twitter.key,
          secret: req.session.user.twitter.secret,
          searchTerm: req.body.searchTerm
        };
        return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, searchSuccess: 'Successfully Updated!'});
      });
      updateQuery.fail(function(error){
        return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, searchError: "Unable to update the database, please try-again!"});
      })
    }
    else{
      return res.render('settings/twitterSettings', {title: 'Settings', user: req.session.user, searchError: "All Fields Required!"});
    }
  }
};
