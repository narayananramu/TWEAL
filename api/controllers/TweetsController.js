/**
 * TweetsController
 *
 * @description :: Server-side logic for managing Tweets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'index': function(request,response,next){
    return response.render('tweet/tweet.ejs',{title: 'Live Feed • TWEAL', user: request.session.user});
  },
  'tweetSearch':function(request,response,next){
    return response.render('tweet/tweetSearch.ejs',{title: 'Search Feed • TWEAL', user: request.session.user});
  }
};

