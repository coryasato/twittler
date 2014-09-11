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

  // Set the main array stream.
  user.setHomeView = function() {
    this.username = window.streams.home;
    this.getTweets();
  };

  // Creates a new object to push to.
  var createVisitor = function(name, message) {
    var username = {};
    username.user = name;
    window.streams.users[name] = [];
    window.streams.users[name].push(username);
  };
  
  var init = function() {
    return user.getTweets();
  };

  // Get the value from the data attr and pass it to our user object.
  $('.tweet-container').on('click', '.user-name', function() {
    var username = $(this).data('user');
    user.setUserView(username);
  });
  // Home view on logo click.
  $('.twitter-icon, .icon-home').on('click', function() {
    user.setHomeView();
  });

  // Prevent empty tweets.
  $('#tweetModal').on('show.bs.modal', function() {
    var $textarea = $('.form-text');
    var $tweetFormSubmit = $('.tweet-form-submit');

    $tweetFormSubmit.prop('disabled', true);
    
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
    var $message = $('.form-text').val();
    var $guestName = $('.guest-name').val();

    // Set global visitor by input or default.  writeTweet() expects this to be handled.
    window.visitor = $guestName || "visitor";

    if(window.streams.users[window.visitor] === undefined) {
      createVisitor(window.visitor);
    }

    // Using the given utility function to pass our tweet.
    writeTweet($message);
    user.getTweets();
    $('#tweetModal').modal('hide');
  });

  // Clear the inputs on modal hide event.
  $('#tweetModal').on('hidden.bs.modal', function() {
      $('.form-text').val('');
      $('.guest-name').val('');
  });

  // Initialize!
  init();

});
