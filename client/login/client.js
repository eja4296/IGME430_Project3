// Handle user login
const handleLogin = (e) => {
  e.preventDefault();
  
 $("#errorBubble").animate({opacity: 0},400);
  document.querySelector("#errorBubble").style.display = "none";
  
  if($("#user").val() == '' || $("#pass").val() == ''){
    handleError("Username or password is empty");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  
  return false;
};

// Handle user signup
const handleSignup = (e) => {
  e.preventDefault();
  
 $("#errorBubble").animate({opacity: 0},400);
  document.querySelector("#errorBubble").style.display = "none";
  
  if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
    handleError("All fields are required");
    return false;
  }
  
  if($("#pass").val() !== $("#pass2").val()){
    handleError("Passwords do not match");
    return false;
  }
  
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  
  return false;
};

// Login window
const LoginWindow = (props) => {
  return(
    <div className="container">
    <div className="section">
    <div className="row">
    <form id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm col s12 m6 l4 offset-l4 offset-m3"
      >
    <div className="input-field">
    <input id="user" type="text" name="username" className="validate"/>
    <label htmlFor="username">Username: </label>
    </div>
    <div className="input-field">
    <input id="pass" type="password" name="pass" className="validate"/>
    <label htmlFor="pass">Password: </label>
    </div>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input className="formSubmit  waves-effect waves-light btn" type="submit" value="Sign In"/>
    </form>
    </div>
    </div>
    </div>
  );
};

// Singup Window
const SignupWindow = (props) => {
  return(
    <div className="container">
    <div className="section">
    <div className="row">
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm col s12 m6 l4 offset-l4 offset-m3"
      >
    <div className="input-field">
    <input id="user" type="text" name="username" className="validate"/>
    <label htmlFor="username">Username: </label>
    </div>
    
    <div className="input-field">
    <input id="pass" type="password" name="pass" className="validate"/>
    <label htmlFor="pass">Password: </label>
    </div>
    
    <div className="input-field">
    <input id="pass2" type="password" name="pass2" className="validate"/>
    <label htmlFor="pass2">Retype Password: </label>
    </div>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input className="formSubmit waves-effect waves-light btn" type="submit" value="Sign Up"/>
    </form>
    </div>
    </div>
    </div>
  );
};

// React call for login
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// React call for signup
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Initial page seetup
const setup = (csrf) => {
  // set up listeners for buttons
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  
  signupButton.addEventListener("click", (e) =>{
    e.preventDefault();
    createSignupWindow(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });
  
  loginButton.addEventListener("click", (e) => {
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

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});