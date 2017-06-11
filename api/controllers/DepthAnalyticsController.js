/**
 * DepthAnalyticsController
 *
 * @description :: Server-side logic for managing Depthanalytics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Twit = require('twit');
var sentimentAnalysis = require('sentiment');
var Promise = require("bluebird");

function fetchTweet(totalPositiveTweets,totalPositiveScore,totalNegativeTweets,totalNegativeScore,totalNeutralTweets,totalTweets,totalScore,iteration,T,query,count,last_id,callback){
  if(iteration != 0){
    T.get('search/tweets', { q: query, count: count, last_id: last_id}, function(err, data) {
      if(err){
        console.log(err);
        if(err.statusCode == 429){
          callback(totalPositiveTweets,totalPositiveScore,totalNegativeTweets,totalNegativeScore,totalNeutralTweets,totalTweets,totalScore);
        }
      }
      else{
        var last_id_q = data.statuses[(data.statuses.length)-1]['id_str'];
        Promise.each(data.statuses, function(tweet) {
          var sentiment = sentimentAnalysis(tweet.text);
          totalScore += sentiment.score;
          if(sentiment.score > 0){
            totalPositiveScore += sentiment.score;
            totalPositiveTweets++;
            totalTweets++;
          }
          else if(sentiment.score < 0){
            totalNegativeScore += sentiment.score;
            totalNegativeTweets++;
            totalTweets++;
          }
          else{
            totalNeutralTweets++;
            totalTweets++;
          }
        }).then(function() {
          iteration --;
          fetchTweet(totalPositiveTweets,totalPositiveScore,totalNegativeTweets,totalNegativeScore,totalNeutralTweets,totalTweets,totalScore,iteration,T,query,count,last_id_q,callback);
        });
      }
    });
  }else{
    callback(totalPositiveTweets,totalPositiveScore,totalNegativeTweets,totalNegativeScore,totalNeutralTweets,totalTweets,totalScore);
  }
}
module.exports = {
  'index': function(request,response,next){
    return response.render('tweet/performDepthAnalytics.ejs',{title: 'Depth Analytics • TWEAL', user: request.session.user});
  },
  'depth':function(request,response,next){
    if(request.body.limit){
      var T = new Twit({
        consumer_key:         'zV8Ak9heBZMSE6Xqu34J1d13l',
        consumer_secret:      'ixCAhv8lqojuHQESE7JpGvGOAQMcfDeT4owVe75l1tLLwWsUqD',
        access_token:         request.session.user.twitter.key,
        access_token_secret:  request.session.user.twitter.secret,
        timeout_ms:           60*1000
      });
      var iterations = (parseInt(request.body.limit)/100);
      fetchTweet(0,0,0,0,0,0,0,iterations,T,request.session.user.twitter.searchTerm,parseInt(request.body.limit),'',function (totalPositiveTweets,totalPositiveScore,totalNegativeTweets,totalNegativeScore,totalNeutralTweets,totalTweets,totalScore) {
        if(totalTweets == 0){
          return response.status(200).send({error: true, message: "API Call Limit Exceeded!"});
        }
        else{
          return response.status(200).send({error: false, total: totalTweets, totalScore: totalScore,totalPositive:totalPositiveTweets,totalPositiveScore: totalPositiveScore,totalNeutral: totalNeutralTweets,totalNegative: totalNegativeTweets,totalNegativeScore: totalNegativeScore});
        }
      });
    }
  }
};

