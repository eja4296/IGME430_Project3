// Global variables
let csrfToken;
let userCredit;
let userName;

// Handle adding user credit
const handleAddCredit = (e) => {
  e.preventDefault();
  
  $("#errorBubble").animate({opacity: 0},400);
  document.querySelector("#errorBubble").style.display = "none";
  
  if($("#domoCreditUpdate").val() == ''){
    handleError("All fields are required");
    return false;
  }
  
  if($("#domoCreditUpdate").val() <= 0){
    handleError("Must add positive value");
    return false;
  }
  
  sendAjax('POST', $("#userCreditForm").attr("action"), $("#userCreditForm").serialize(), function() {
    loadUserData();
  });
  
  return false;
};

// Handle Flip Coin Game
const flipCoin = (e) => {
  e.preventDefault();
  
  $("#errorBubble").animate({opacity: 0},400);
  document.querySelector("#errorBubble").style.display = "none";
  
  if($("#coinGuess").val() == '' || $("#coinBet").val() == ''){
    handleError("All fields are required");
    return false;
  }
  
  if(document.querySelector("#coinBet").value <= 0){
    handleError("Bet must be positive value");
    return false;
  }
  
  if(userCredit <= 0 || document.querySelector("#coinBet").value > userCredit){
    handleError("Insufficient Credits");
    return false;
  }
  
  // Flip coin calculations
  const randNum = Math.floor(Math.random() * 100);
  let addCredit;
  let result;
  if(randNum % 2 == 0){
    result = "Heads";
  }
  else{
    result = "Tails";
  }
  
  if(result == document.querySelector("#coinGuess").value){
    addCredit = document.querySelector("#coinBet").value;
  }
  else{
    addCredit = document.querySelector("#coinBet").value * -1;
  }
  
  document.querySelector("#flipCoinUpdate").value = addCredit;
  console.dir(userCredit);
  
  
  document.querySelector("#flipCoinResult").innerHTML = "Result: " + result;
  
  sendAjax('POST', $("#flipCoinForm").attr("action"), $("#flipCoinForm").serialize(), function() {
    loadUserData();
  });
  
  return false;
};

// Handle Changing Password
const handleChangePass= (e) => {
  e.preventDefault();
  
  $("#errorBubble").animate({opacity: 0},400);
  document.querySelector("#errorBubble").style.display = "none";
  
  if($("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == ''){
    handleError("All Fields Necessary");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  
  return false;
};

// Handle updating message board
const handleMessageUpdate = (e) => {
  e.preventDefault();
  
  $("#errorBubble").animate({opacity: 0},400);
  document.querySelector("#errorBubble").style.display = "none";
  
  if($("#messageUsername").val() == '' || $("#messageGame").val() == '' || $("#messageMoney").val() == ''){
    handleError("All Fields Necessary");
    return false;
  }
  
  if($("#messageMoney").val() <= 0){
    handleError("Must be a positive value");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $("#createMessageForm").attr("action"), $("#createMessageForm").serialize(), function() {
    loadMessagesFromServer();
  });
  
  return false;
  
};

// Home page, add credits
const CreditForm = (props) => {
  return(
    <div id="forms">
    <div className="row">
    <div id="about" className="col s6 center-align offset-s3">
      <p>Thank you for visiting my Online Casino! When the website is fully functional, you will be required to provide payment information, but for now, please feel free to add credits (up to $100000) to test it out. Enjoy!</p>
    </div>
    </div>
    
    <div className="row">
    <form id="userCreditForm"
          onSubmit={handleAddCredit}
          name="userCreditForm"
          action="/updateCredit"
          method="POST"
          className="domoForm col s12 m6 l4"
      >
            
            <h2 className="formHead">Add Funds</h2>
        <label htmlFor="credit">Credits: </label>
        <input id="domoCreditUpdate" type="number" name="credit" placeholder="$1"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit waves-effect waves-light btn" type="submit" value="Add Funds" />
    </form>
    </div>
    </div>
  );
};

// React call for home page
const showAddCredit = (csrf) => {
  ReactDOM.render(
    <CreditForm csrf={csrf} />,
    document.querySelector("#makeDomo")
  );
};

// Game page, play games
const Games = (props) => {
  return(
    <div id="games">
      <div className="row">
    <h2 className="formHead">Play Games</h2>

      </div>
        
      <div className="row">
      <h2>Coin Flip</h2>
      <p className="gameRules">Guess heads or tails, place a bet, and flip the coin!</p>
        
      <form id="flipCoinForm"
            onSubmit={flipCoin}
            name="flipCoinForm"
            action="/updateCredit"
            method="POST"
            className="domoForm"
        >
          
          <div className="input-field col s12">
            <select id="coinGuess">
              <option value="" disabled>Choose your option</option>
              <option value="Heads">Heads</option>
              <option value="Tails">Tails</option>
            </select>
            <label >Guess: </label>
          </div>
    
          <label htmlFor="bet">Bet: </label>
          <input id="coinBet" type="number" min="1" name="bet" placeholder="$1"/>
          <input id="flipCoinUpdate" type="hidden" name="credit" value="-1"/>
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input className="makeDomoSubmit waves-effect waves-light btn" type="submit" value="Flip Coin" />
      </form>
      <h2 id="flipCoinResult">Result: </h2>
          </div>

    <div className="row">
      <h2>More games coming soon...</h2>
      
    </div>
    </div>
  );
};

// React call for game page
const showGames = (csrf) => {
  ReactDOM.render(
    <Games  csrf={csrf}/>,
    document.querySelector("#makeDomo")
  );
};

// Message page, create messages to post, see other people's messages
const Messages = (props) => {
  return(
    <div>
    <h2 className="formHead">Post Messages</h2>
    <form id="createMessageForm"
          onSubmit={handleMessageUpdate}
          name="createMessageForm"
          action="/createMessage"
          method="POST"
          className="messageForm"
      >
        <input type="hidden" name="name" value={userName} />
        
    
    <div className="input-field col s12">
        <select id="messageGame" name="message">
          <option value="Coin Flip">Coin Flip</option>
          <option value="Roulette">Roulette</option>
          <option value="Blackjack 21">Blackjack 21</option>
          <option value="Texas hold 'em">Texas Hold 'em</option>
        </select>
    <label htmlFor="game">Game Played: </label>
    
      </div>
        <label htmlFor="money">Amount Won: </label>
        <input id="messageMoney" type="number" min="1" name="money" placeholder="$1"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit waves-effect waves-light btn" type="submit" value="Post Message" />
    </form>
    <section id="messages">
    </section>
    </div>
  );
};

// React call for message page
const showMessage = (csrf) => {
  ReactDOM.render(
    <Messages  csrf={csrf}/>,
    document.querySelector("#makeDomo")
  );
};

// Account page, shows account information, change password form
const AccountInfo = (props) => {
  return(
    <div id="account">
    <div className="row">
    <div className="col s12 m6">
    <h2 className="formHead">Account Information</h2>
    <div id="accountInfo">
      <h4 >Your Username: {props.user.username}</h4>
      <h4 >Your Credits: ${props.user.credit}</h4>
    </div>
    </div>
    </div>
    
    <div className="row">
      <form id="changePassForm"
      name="changePassForm"
      onSubmit={handleChangePass}
      action="/changePass"
      method="POST"
      className="mainForm col s12 m6 l4"
      >
    <h2>Change Password</h2>
    
    <input id="user" type="hidden" name="username" value={props.user.username}/>
    <label htmlFor="pass">Current Password: </label>
    <input id="pass" type="password" name="pass" placeholder="current password"/>
    <label htmlFor="newpass">New Password: </label>
    <input id="newpass" type="password" name="newpass" placeholder="new password"/>
    <label htmlFor="newpass2">New Password: </label>
    <input id="newpass2" type="password" name="newpass2" placeholder="retype new password"/>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input className="formSubmit waves-effect waves-light btn" type="submit" value="Change Password"/>
    </form>
    </div>
    </div>
  );
};

// React call for accoutn page
const showAccountInfo = (csrf) => {
   sendAjax('GET', '/getUser', null, (data) => {
    ReactDOM.render(
      <AccountInfo csrf={csrf} user={data.user} />,
      document.querySelector("#makeDomo")
    );
  });
};

// Create the list of messages for the message page
const MessageList = function(props) {
  if(props.messages.length === 0){
    return(
      <div className="messageList">
        <h3 className="emptyMessage">No Messages yet</h3>
      </div>
    );
  }
  
  const messageNodes = props.messages.map(function(message) {
    let trimmedDate = message.createdDate.substring(0, 10);
    return(
      <div key={message._id} className="newMessage">
        <img src="/assets/img/777.png" alt="777" className="messageImage" />
        <h3 className="messageUsername">{message.name} won ${message.money} from {message.game}!</h3>
        <p className="createdDate">{trimmedDate}</p>
      </div>
    );
  });
  
  return(
    <div className="messageList">
      {messageNodes}
    </div>
  );
};

// Display user information on the page, and as it updates
const UserInfo = function(props){
  userCredit = props.user.credit;
  userName = props.user.username;
  return(
    <div className="userStuff">
      <h4 id="welcome">Welcome: {props.user.username}</h4>
      <h4 id="credits">Credits: ${props.user.credit}</h4>
    </div>
  );
};

// Load the user's data
const loadUserData = function(props){
  sendAjax('GET', '/getUser', null, (data) => {
    ReactDOM.render(
      <UserInfo user={data.user} />,
      document.querySelector("#userInfo")
    );
  });
};

// Load all messages
const loadMessagesFromServer = () => {
  sendAjax('GET', '/getMessages', null, (data) => {
    ReactDOM.render(
      <MessageList messages={data.messages} />,
      document.querySelector("#messages")
    );
  });
};

// Home page title
const HomeWindow = (props) => {
  return(
    <div>
    <h1 className="pageTitle  center-align">Home</h1>
    </div>
  );
};

// Game page title
const GameWindow = (props) => {
  return(
    <div>
    <h1 className="pageTitle  center-align">Games</h1>
    </div>
  );
};

// Message page title
const MessageWindow = (props) => {
  return(
    <div>
    <h1 className="pageTitle  center-align">Messages</h1>
    </div>
  );
};

// Account page title
const AccountWindow = (props) => {
  return(
    <div>
    <h1 className="pageTitle  center-align">Account</h1>
    </div>
  );
};

// React call for home page
const createHomeWindow = (csrf) => {
  ReactDOM.render(
    <HomeWindow csrf={csrf} />,
    document.querySelector("#pageInfo")
  );
};

// React call for game page
const createGameWindow = (csrf) => {
  ReactDOM.render(
    <GameWindow csrf={csrf} />,
    document.querySelector("#pageInfo")
  );
};

// React call for message page
const createMessageWindow = (csrf) =>{
  ReactDOM.render(
    <MessageWindow csrf={csrf} />,
    document.querySelector("#pageInfo")
  );
};

// React call for account page
const createAccountWindow = (csrf) => {
  ReactDOM.render(
    <AccountWindow csrf={csrf} />,
    document.querySelector("#pageInfo")
  );
};

// Inital page setup
const setup = function(csrf) {
  // set global csrf Token
  csrfToken = csrf;
  
  // set listeners for nav buttons
  const homeNav = document.querySelectorAll(".homeNav");
  const gameNav = document.querySelectorAll(".gameNav");
  const accountNav = document.querySelectorAll(".accountNav");
  const messageNav = document.querySelectorAll(".messageNav");
  
  for(let i = 0; i < homeNav.length; i++){
    homeNav[i].addEventListener("click", (e) =>{
      e.preventDefault();
      createHomeWindow(csrf);

      showAddCredit(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";

      return false;
    });

      gameNav[i].addEventListener("click", (e) =>{
      e.preventDefault();
      createGameWindow(csrf);
      showGames(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";

      return false;
    });

    accountNav[i].addEventListener("click", (e) =>{
      e.preventDefault();
      createAccountWindow(csrf);
      showAccountInfo(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";
      return false;
    });

    messageNav[i].addEventListener("click", (e) =>{
      e.preventDefault();
      createMessageWindow(csrf);
      showMessage(csrf);
      loadMessagesFromServer();
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";
      return false;
    });
  }
  
  
  
  
  
  
  document.querySelector("#errorBubble").style.opacity = 0;
  document.querySelector("#errorBubble").style.display = "none";
  
  showAddCredit(csrf);
  createHomeWindow(csrf);
  loadUserData();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});

$(document).ready(function(){
    $('.sidenav').sidenav();
  });

 $(document).ready(function(){
    $('select').formSelect();
  });
/*
 $(document).ready(function() {
    $('select').material_select();
  });
*/