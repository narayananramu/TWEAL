$(document).ready(function(){
  io.socket.get('/searchTweets/join', {}, function (resData, jwres){
    console.log(resData);
  });
  io.socket.on('newSearchTweet', function (resData, jwres){
    console.log(resData);
    $('#tweetWall').append("<div class='row'><div class='col-xs-12 col-md-7'>"+resData.tweetHTML+ "</div><div class='col-xs-12 col-md-5 sentiment-box'><blockquote><b>Score</b>:"+resData.sentiment.score+"<br/><b>Comparative</b>:"+resData.sentiment.comparative.toFixed(4)+"<br/><b>Positives</b>:"+resData.sentiment.positive.toString()+"<br/><b>Negatives</b>:"+resData.sentiment.negative.toString()+"<br/></blockquote></div></div>");
  });
});
