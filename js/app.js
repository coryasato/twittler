$(document).ready(function(){

  var user = {
    username: window.streams.home
  };

  // Populate tweets.  A sloppy view that updates itself every 1500ms.
  user.getTweets = function() {
    var index = this.username.length - 1;
    var $tweetContainer = $('.tweet-container');
    $tweetContainer.html('');

    while (index >= 0) {
      var tweet = this.username[index];
      var createdAt = moment(tweet.created_at);
      var $html = $(template);

      var template = [
        '<div class="tweet">',
          '<p>',
            '<a href="#" data-user=' + '"' + tweet.user + '"'+ 'class="user-name">' + '@' + tweet.user + '</a>',
          ' : ' + tweet.message,
          '<p class="tweet-time">Tweeted: ' + moment(createdAt).fromNow()  + '</p>',
          '</p>',
        '</div>'
      ].join(" ");

      $html.appendTo($tweetContainer);
      index--;
    }
    setTimeout(function() { user.getTweets(); }, 1500);
  };

  // Set the streams.users array by username.
  user.setUserView = function(username) {
    this.username = streams.users[username];
    this.getTweets();
  };

  //  Set the main array stream.
  user.setHomeView = function() {
    this.username = window.streams.home;
    this.getTweets();
  };

  // Get the value from the data attr and pass it to our user object.
  $('.tweet-container').on('click', '.user-name', function() {
    var username = $(this).data('user');
    user.setUserView(username);
  });
  // Home view on logo click.
  $('.twitter-icon').on('click', function() {
    user.setHomeView();
  });

  // Initialize!
  user.getTweets();




// $('#myModal').on('show.bs.modal', function(e) {
//   var target = e.relatedTarget;
//   var username = target.dataset.user;

//   $('#modalLabel').html(username);
// });

});
