"use strict";

// Global variables
var csrfToken = void 0;
var userCredit = void 0;
var userName = void 0;

// Handle adding user credit
var handleAddCredit = function handleAddCredit(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#domoCreditUpdate").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#domoCreditUpdate").val() <= 0) {
    handleError("Must add positive value");
    return false;
  }

  sendAjax('POST', $("#userCreditForm").attr("action"), $("#userCreditForm").serialize(), function () {
    loadUserData();
  });

  return false;
};

// Handle Flip Coin Game
var flipCoin = function flipCoin(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#coinGuess").val() == '' || $("#coinBet").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if (document.querySelector("#coinBet").value <= 0) {
    handleError("Bet must be positive value");
    return false;
  }

  if (userCredit <= 0 || document.querySelector("#coinBet").value > userCredit) {
    handleError("Insufficient Credits");
    return false;
  }

  // Flip coin calculations
  var randNum = Math.floor(Math.random() * 100);
  var addCredit = void 0;
  var result = void 0;
  if (randNum % 2 == 0) {
    result = "Heads";
  } else {
    result = "Tails";
  }

  if (result == document.querySelector("#coinGuess").value) {
    addCredit = document.querySelector("#coinBet").value;
  } else {
    addCredit = document.querySelector("#coinBet").value * -1;
  }

  document.querySelector("#flipCoinUpdate").value = addCredit;
  console.dir(userCredit);

  document.querySelector("#flipCoinResult").innerHTML = "Result: " + result;

  sendAjax('POST', $("#flipCoinForm").attr("action"), $("#flipCoinForm").serialize(), function () {
    loadUserData();
  });

  return false;
};

// Handle Changing Password
var handleChangePass = function handleChangePass(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
    handleError("All Fields Necessary");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

  return false;
};

// Handle updating message board
var handleMessageUpdate = function handleMessageUpdate(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#messageUsername").val() == '' || $("#messageGame").val() == '' || $("#messageMoney").val() == '') {
    handleError("All Fields Necessary");
    return false;
  }

  if ($("#messageMoney").val() <= 0) {
    handleError("Must be a positive value");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#createMessageForm").attr("action"), $("#createMessageForm").serialize(), function () {
    loadMessagesFromServer();
  });

  return false;
};

// Home page, add credits
var CreditForm = function CreditForm(props) {
  return React.createElement(
    "div",
    { id: "forms" },
    React.createElement(
      "section",
      { id: "about" },
      React.createElement(
        "h2",
        null,
        "Thank you for visiting my Online Casino! When the website is fully functional, you will be required to provide payment information, but for now, please feel free to add credits (up to $100000) to test it out. Enjoy!"
      )
    ),
    React.createElement(
      "h2",
      { className: "formHead" },
      "Add Funds"
    ),
    React.createElement(
      "form",
      { id: "userCreditForm",
        onSubmit: handleAddCredit,
        name: "userCreditForm",
        action: "/updateCredit",
        method: "POST",
        className: "domoForm"
      },
      React.createElement(
        "label",
        { htmlFor: "credit" },
        "Credits: "
      ),
      React.createElement("input", { id: "domoCreditUpdate", type: "number", name: "credit", placeholder: "$1" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Add Funds" })
    )
  );
};

// React call for home page
var showAddCredit = function showAddCredit(csrf) {
  ReactDOM.render(React.createElement(CreditForm, { csrf: csrf }), document.querySelector("#makeDomo"));
};

// Game page, play games
var Games = function Games(props) {
  return React.createElement(
    "div",
    { id: "games" },
    React.createElement(
      "h2",
      { className: "formHead" },
      "Play Games"
    ),
    React.createElement(
      "section",
      { className: "game" },
      React.createElement(
        "h2",
        null,
        "Coin Flip"
      ),
      React.createElement(
        "p",
        { className: "gameRules" },
        "Guess heads or tails, place a bet, and flip the coin!"
      ),
      React.createElement(
        "form",
        { id: "flipCoinForm",
          onSubmit: flipCoin,
          name: "flipCoinForm",
          action: "/updateCredit",
          method: "POST",
          className: "domoForm"
        },
        React.createElement(
          "label",
          { htmlFor: "guess" },
          "Guess: "
        ),
        React.createElement(
          "select",
          { id: "coinGuess", guess: "game" },
          React.createElement(
            "option",
            { value: "Heads" },
            "Heads"
          ),
          React.createElement(
            "option",
            { value: "Tails" },
            "Tails"
          )
        ),
        React.createElement(
          "label",
          { htmlFor: "bet" },
          "Bet: "
        ),
        React.createElement("input", { id: "coinBet", type: "number", min: "1", name: "bet", placeholder: "$1" }),
        React.createElement("input", { id: "flipCoinUpdate", type: "hidden", name: "credit", value: "-1" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Flip Coin" })
      ),
      React.createElement(
        "h2",
        { id: "flipCoinResult" },
        "Result: "
      )
    ),
    React.createElement(
      "section",
      { className: "game" },
      React.createElement(
        "h2",
        null,
        "More games coming soon..."
      )
    )
  );
};

// React call for game page
var showGames = function showGames(csrf) {
  ReactDOM.render(React.createElement(Games, { csrf: csrf }), document.querySelector("#makeDomo"));
};

// Message page, create messages to post, see other people's messages
var Messages = function Messages(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      { className: "formHead" },
      "Post Messages"
    ),
    React.createElement(
      "form",
      { id: "createMessageForm",
        onSubmit: handleMessageUpdate,
        name: "createMessageForm",
        action: "/createMessage",
        method: "POST",
        className: "messageForm"
      },
      React.createElement("input", { type: "hidden", name: "name", value: userName }),
      React.createElement(
        "label",
        { htmlFor: "game" },
        "Game Played: "
      ),
      React.createElement(
        "select",
        { id: "messageGame", name: "game" },
        React.createElement(
          "option",
          { value: "Coin Flip" },
          "Coin Flip"
        ),
        React.createElement(
          "option",
          { value: "Roulette" },
          "Roulette"
        ),
        React.createElement(
          "option",
          { value: "Blackjack 21" },
          "Blackjack 21"
        ),
        React.createElement(
          "option",
          { value: "Texas hold 'em" },
          "Texas Hold 'em"
        )
      ),
      React.createElement(
        "label",
        { htmlFor: "money" },
        "Amount Won: "
      ),
      React.createElement("input", { id: "messageMoney", type: "number", min: "1", name: "money", placeholder: "$1" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Post Message" })
    ),
    React.createElement("section", { id: "messages" })
  );
};

// React call for message page
var showMessage = function showMessage(csrf) {
  ReactDOM.render(React.createElement(Messages, { csrf: csrf }), document.querySelector("#makeDomo"));
};

// Account page, shows account information, change password form
var AccountInfo = function AccountInfo(props) {
  return React.createElement(
    "div",
    { id: "account" },
    React.createElement(
      "h2",
      { className: "formHead" },
      "Account Information"
    ),
    React.createElement(
      "div",
      { id: "accountInfo" },
      React.createElement(
        "h3",
        null,
        "Your Name: ",
        React.createElement(
          "p",
          { className: "userInformation" },
          props.user.username
        )
      ),
      React.createElement(
        "h3",
        null,
        "Your Credits: ",
        React.createElement(
          "p",
          { className: "userInformation" },
          "$",
          props.user.credit
        )
      )
    ),
    React.createElement(
      "form",
      { id: "changePassForm",
        name: "changePassForm",
        onSubmit: handleChangePass,
        action: "/changePass",
        method: "POST",
        className: "mainForm"
      },
      React.createElement(
        "h2",
        null,
        "Change Password"
      ),
      React.createElement(
        "label",
        { htmlFor: "username" },
        "Username: "
      ),
      React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
      React.createElement(
        "label",
        { htmlFor: "pass" },
        "Current Password: "
      ),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "current password" }),
      React.createElement(
        "label",
        { htmlFor: "newpass" },
        "New Password: "
      ),
      React.createElement("input", { id: "newpass", type: "password", name: "newpass", placeholder: "new password" }),
      React.createElement(
        "label",
        { htmlFor: "newpass2" },
        "New Password: "
      ),
      React.createElement("input", { id: "newpass2", type: "password", name: "newpass2", placeholder: "retype new password" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
    )
  );
};

// React call for accoutn page
var showAccountInfo = function showAccountInfo(csrf) {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render(React.createElement(AccountInfo, { csrf: csrf, user: data.user }), document.querySelector("#makeDomo"));
  });
};

// Create the list of messages for the message page
var MessageList = function MessageList(props) {
  if (props.messages.length === 0) {
    return React.createElement(
      "div",
      { className: "messageList" },
      React.createElement(
        "h3",
        { className: "emptyMessage" },
        "No Messages yet"
      )
    );
  }

  var messageNodes = props.messages.map(function (message) {
    var trimmedDate = message.createdDate.substring(0, 10);
    return React.createElement(
      "div",
      { key: message._id, className: "newMessage" },
      React.createElement("img", { src: "/assets/img/777.png", alt: "777", className: "messageImage" }),
      React.createElement(
        "h3",
        { className: "messageUsername" },
        message.name,
        " won $",
        message.money,
        " from ",
        message.game,
        "!"
      ),
      React.createElement(
        "p",
        { className: "createdDate" },
        trimmedDate
      )
    );
  });

  return React.createElement(
    "div",
    { className: "messageList" },
    messageNodes
  );
};

// Display user information on the page, and as it updates
var UserInfo = function UserInfo(props) {
  userCredit = props.user.credit;
  userName = props.user.username;
  return React.createElement(
    "div",
    { className: "userStuff" },
    React.createElement(
      "h1",
      { id: "welcome" },
      "Welcome: ",
      React.createElement(
        "p",
        { className: "userInformation" },
        props.user.username
      )
    ),
    React.createElement(
      "h1",
      { id: "credits" },
      "Credits: ",
      React.createElement(
        "p",
        { className: "userInformation" },
        "$",
        props.user.credit
      )
    )
  );
};

// Load the user's data
var loadUserData = function loadUserData(props) {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render(React.createElement(UserInfo, { user: data.user }), document.querySelector("#userInfo"));
  });
};

// Load all messages
var loadMessagesFromServer = function loadMessagesFromServer() {
  sendAjax('GET', '/getMessages', null, function (data) {
    ReactDOM.render(React.createElement(MessageList, { messages: data.messages }), document.querySelector("#messages"));
  });
};

// Home page title
var HomeWindow = function HomeWindow(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      { className: "pageTitle" },
      "Home"
    )
  );
};

// Game page title
var GameWindow = function GameWindow(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      { className: "pageTitle" },
      "Games"
    )
  );
};

// Message page title
var MessageWindow = function MessageWindow(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      { className: "pageTitle" },
      "Messages"
    )
  );
};

// Account page title
var AccountWindow = function AccountWindow(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      { className: "pageTitle" },
      "Account"
    )
  );
};

// React call for home page
var createHomeWindow = function createHomeWindow(csrf) {
  ReactDOM.render(React.createElement(HomeWindow, { csrf: csrf }), document.querySelector("#pageInfo"));
};

// React call for game page
var createGameWindow = function createGameWindow(csrf) {
  ReactDOM.render(React.createElement(GameWindow, { csrf: csrf }), document.querySelector("#pageInfo"));
};

// React call for message page
var createMessageWindow = function createMessageWindow(csrf) {
  ReactDOM.render(React.createElement(MessageWindow, { csrf: csrf }), document.querySelector("#pageInfo"));
};

// React call for account page
var createAccountWindow = function createAccountWindow(csrf) {
  ReactDOM.render(React.createElement(AccountWindow, { csrf: csrf }), document.querySelector("#pageInfo"));
};

// Inital page setup
var setup = function setup(csrf) {
  // set global csrf Token
  csrfToken = csrf;

  // set listeners for nav buttons
  var homeNav = document.querySelector("#homeNav");
  var gameNav = document.querySelector("#gameNav");
  var accountNav = document.querySelector("#accountNav");
  var messageNav = document.querySelector("#messageNav");

  homeNav.addEventListener("click", function (e) {
    e.preventDefault();
    createHomeWindow(csrf);

    showAddCredit(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";

    return false;
  });

  gameNav.addEventListener("click", function (e) {
    e.preventDefault();
    createGameWindow(csrf);
    showGames(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });

  accountNav.addEventListener("click", function (e) {
    e.preventDefault();
    createAccountWindow(csrf);
    showAccountInfo(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });

  messageNav.addEventListener("click", function (e) {
    e.preventDefault();
    createMessageWindow(csrf);
    showMessage(csrf);
    loadMessagesFromServer();
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });

  document.querySelector("#errorBubble").style.opacity = 0;
  document.querySelector("#errorBubble").style.display = "none";

  showAddCredit(csrf);
  createHomeWindow(csrf);
  loadUserData();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {

  $("#errorBubble").animate({ opacity: 1 }, 400);
  document.querySelector("#errorBubble").style.display = "inline";
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  $("#errorBubble").animate({ opacity: 0 }, 400);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
