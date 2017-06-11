$(document).ready(function(){
  $('button#startLive').show();
  $('button#stopLive').hide();

  $('button#startLive').click(function(){
    $(this).button('loading');
    $('div#tweetWall').html('');
    $('div#cssloader').show();
    $('p#statusText1').html('Listening to Tweets!');
    $('p#statusText2').html('Please Wait...');
    io.socket.get('/tweets/join', {}, function (resData, jwres){
      if(resData.error){
        alert('Unable to join the sever!');
      }
      else{
        io.socket.on('newLiveTweet', function (resData, jwres){
          $('div#cssloader').hide();
          $('button#startLive').hide();
          $('button#startLive').button('reset');
          $('button#stopLive').show();
          $('#tweetWall').prepend("<div class='row'><div class='col-xs-12 col-md-7'>"+resData.tweetHTML+ "</div><div class='col-xs-12 col-md-5 sentiment-box'><blockquote><b>Score</b>:"+resData.sentiment.score+"<br/><b>Comparative</b>:"+resData.sentiment.comparative+"<br/><b>Positives</b>:"+resData.sentiment.positive.toString()+"<br/><b>Negatives</b>:"+resData.sentiment.negative.toString()+"<br/></blockquote></div></div>");
        });
      }
    });

    $('button#stopLive').click(function(){
      $(this).button('loading');
      io.socket.get('/tweets/disconnect', {}, function (resData, jwres){
        $('button#startLive').show();
        $('button#stopLive').hide();
        $('button#stopLive').button('reset');
        $('p#statusText1').html('Go Live');
        $('p#statusText2').html('To Start Listening!');
      });
    });
  });

  io.socket.on('disconnect', function(){
  });
});
