"use strict";

// Handle user login
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// Handle user signup
var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// Login window
var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(
      "div",
      { className: "section" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "form",
          { id: "loginForm",
            name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm col s12 m6 l4 offset-l4 offset-m3"
          },
          React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
          ),
          React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
          React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
          ),
          React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
          React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
          React.createElement("input", { className: "formSubmit waves-effect waves-light btn", type: "submit", value: "Sign In" })
        )
      )
    )
  );
};

// Singup Window
var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "div",
    { className: "container" },
    React.createElement(
      "div",
      { className: "section" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "form",
          { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm col s12 m6 l4 offset-l4 offset-m3"
          },
          React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
          ),
          React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
          React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
          ),
          React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
          React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
          ),
          React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
          React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
          React.createElement("input", { className: "formSubmit waves-effect waves-light btn", type: "submit", value: "Sign Up" })
        )
      )
    )
  );
};

// React call for login
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

// React call for signup
var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Initial page seetup
var setup = function setup(csrf) {
  // set up listeners for buttons
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });

  document.querySelector("#errorBubble").style.opacity = 0;
  document.querySelector("#errorBubble").style.display = "none";
  createLoginWindow(csrf);
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
