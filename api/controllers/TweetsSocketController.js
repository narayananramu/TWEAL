/**
 * TweetsSocketController
 *
 * @description :: Server-side logic for managing Tweetssockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Twit = require('twit');
var axios = require('axios');
var sentiment = require('sentiment');
module.exports = {
	'join': function(request,response,next) {
    var createHash = require('sha.js'),
      sha256 = createHash('sha256');
    request.session.liveTweetRoom = sha256.update("liveFloor"+request.session.user.id+(new Date().valueOf())).digest('hex');
    sails.sockets.join(request,request.session.liveTweetRoom,function(error) {
      if (error) {
        console.log(error);
        return response.status(200).send({error: true, message: "Subscribed Failed!"});
      }
      else {
        var T = new Twit({
          consumer_key:         'zV8Ak9heBZMSE6Xqu34J1d13l',
          consumer_secret:      'ixCAhv8lqojuHQESE7JpGvGOAQMcfDeT4owVe75l1tLLwWsUqD',
          access_token:         request.session.user.twitter.key,
          access_token_secret:  request.session.user.twitter.secret,
          timeout_ms:           60*1000
        });
        var twitterStream = T.stream('statuses/filter', { track: request.session.user.twitter.searchTerm });
        twitterStream.on('tweet', function (tweet) {
          axios
            .get('https://api.twitter.com/1.1/statuses/oembed.json?id='+tweet.id_str)
            .then(function(axiosResponse){
              sails.io.sockets.in(request.session.liveTweetRoom).clients(function(err, socketIds) {
                if(socketIds.length == 1){
                  sails.sockets.broadcast(request.session.liveTweetRoom,'newLiveTweet',{ sentiment: sentiment(tweet.text), tweetHTML: axiosResponse.data.html})
                }
                else{
                  twitterStream.stop(function(){
                    twitterStream = null;
                  });
                  request.session.liveTweetRoom = null;
                }
              });
            })
            .catch(function(axiosError){
              console.log(axiosError);
              sails.sockets.broadcast(request.session.liveTweetRoom,'newLiveTweet',{ disconnect: "Stream Disconnected!"});
            });
        });
        twitterStream.on('disconnect', function(message){
          console.log(message);
        });
        response.status(200).send({error: null, message: "Subscribed Successfully!"});
      }
    });
  },
  'disconnectLive': function(request,response,next){
    sails.sockets.leave(request, request.session.liveTweetRoom);
    return response.status(200).send({error: null, message: "Left Successfully!"})
  },
  'joinSearch': function(request,response,next) {
    var T = new Twit({
      consumer_key:         'zV8Ak9heBZMSE6Xqu34J1d13l',
      consumer_secret:      'ixCAhv8lqojuHQESE7JpGvGOAQMcfDeT4owVe75l1tLLwWsUqD',
      access_token:         request.session.user.twitter.key,
      access_token_secret:  request.session.user.twitter.secret,
      timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
    });
    T.get('search/tweets', { q: request.session.user.twitter.searchTerm, count: 200 }, function(err, data, response) {
      if(err){
        console.log(err);
      }
      else{
        data.statuses.forEach(function(tweet){
          axios
            .get('https://api.twitter.com/1.1/statuses/oembed.json?id='+tweet.id_str)
            .then(function(axiosResponse){
              sails.sockets.broadcast(sails.sockets.getId(request),'newSearchTweet',{ sentiment: sentiment(tweet.text), tweetHTML: axiosResponse.data.html})
            })
            .catch(function(axiosError){
              console.log(axiosError);
            });
        });
      }
    });
    return response.status(200).json({subscribed: true});
  }
};

