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
    setTimeout(function() { user.getTweets(); }, 10000);
  };

  // Set the streams.users array by username.
  user.setUserView = function(username) {
    this.username = streams.users[username];
    this.getTweets();
  };

  // Set the main array stream.
  user.setHomeView = function() {
    this.username = window.streams.home;
    this.getTweets();
  };
  // Creates a new object to push to.
  var createVisitor = function(name) {
    var username = {};
    username.name = name;
    window.streams.users[name] = [];
    window.streams.users[name].push(username);
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

  // Prevent empty tweets.
  $('#tweetModal').on('shown.bs.modal', function() {
    var $textarea = $('.form-text');
    var $tweetFormSubmit = $('.tweet-form-submit');
    
    $textarea.on('keydown', function() {
      if ($textarea.val().length > 1) {
        $tweetFormSubmit.prop('disabled', false);
      } else {
        $tweetFormSubmit.prop('disabled', true);
      }
    });
  });

  //  Handle form submit calls
  $('#tweetForm').on('submit', function(e) {
    e.preventDefault();
    var $data = $('.form-text').val();
    var $guestName = $('.guest-name').val();

    // Set global visitor by input or default.  writeTweet() expects this to be handled.
    window.visitor = $guestName || "visitor";
    createVisitor(window.visitor);
    // Using the given utility function to pass our tweet.
    writeTweet($data);
    user.getTweets();

    $('#tweetModal').modal('hide');
  });

  $('#tweetModal').on('hidden.bs.modal', function(e) {
      $('.form-text').empty();
    });



  // Initialize!
  user.getTweets();

});
