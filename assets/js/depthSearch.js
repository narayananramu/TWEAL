$(document).ready(function() {
  var start = new Date();
  $('div#tweetWall').hide();
  $('div#errorMessage').hide();
  $.post('/tweets/depthPerform', {limit: 100}, function (resData, jwres) {
    if(resData.error){
      $('div#cssloader').hide();
      $('div#errorMessage').show();
      $('div#tweetWall').hide();
    }else{
      $('div#cssloader').hide();
      $('div#tweetWall').show();
      $('div#errorMessage').hide();
      $('td#tTw').html(resData.total);
      $('td#tOverSc').html(resData.totalScore);
      $('td#tPosTw').html(resData.totalPositive);
      $('td#tPosSc').html(resData.totalPositiveScore);
      $('td#tNeuTw').html(resData.totalNeutral);
      $('td#tNegTw').html(resData.totalNegative);
      $('td#tNegSc').html(resData.totalNegativeScore);

      var ctx = document.getElementById("myChart");
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            "Positive",
            "Neutral",
            "Negative"
          ],
          datasets: [
            {
              data: [resData.totalPositive, resData.totalNeutral, resData.totalNegative],
              backgroundColor: [
                "#61BB46",
                "#009DDC",
                "#E03A3E"
              ],
              hoverBackgroundColor: [
                "#FDB827",
                "#FFFFFF",
                "#000000"
              ]
            }]
        },
        options: {
          animation: {
            animateScale: true
          }
        }
      });
    }
  });
});
