// Global variables
let csrfToken;
let userCredit;
let userName;

let rouletteColors = ['red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'green', 'green'];
let rouletteNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '0', '00'];

let rouletteResultPercentages = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

let rouletteResultWins = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

let numOfRouletteTrials = 0;

let roulettePastResults = [];


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
  
  if($("#coinBet").val() == ''){
    handleError("Place a bet");
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
  
  let guess;
  let radioButtons = document.getElementsByName('coinFlip');
  
  for(let i = 0; i < radioButtons.length; i++){
    if(radioButtons[i].checked){
      guess = radioButtons[i].value;
    }
  }
  
  if(result == guess){
    addCredit = document.querySelector("#coinBet").value;
  }
  else{
    addCredit = document.querySelector("#coinBet").value * -1;
  }
  
  document.querySelector("#flipCoinUpdate").value = addCredit;
 
  if(addCredit > 0){
    document.querySelector("#flipCoinWinnings").value = addCredit;
  }
  else{
    document.querySelector("#flipCoinWinnings").value = 0;
  }

 
  
  document.querySelector("#flipCoinResult").innerHTML = "Result: " + result;
  
  if(addCredit > 0){
    document.querySelector("#flipCoinWin").innerHTML = " You won $" + addCredit;
  }
  else if(addCredit < 0){
    let tempCredit = addCredit * -1;
    document.querySelector("#flipCoinWin").innerHTML = " You lost $" + tempCredit;
  }
  else{
    document.querySelector("#flipCoinWin").innerHTML = " You broke even";
  }
  
  sendAjax('POST', $("#flipCoinForm").attr("action"), $("#flipCoinForm").serialize(), function() {
    loadUserData();
  });
  
  return false;
};

// Handle Roulette Game
const roulette = (e) => {
  e.preventDefault();
  
  $("#errorBubble").animate({opacity: 0},400);
  document.querySelector("#errorBubble").style.display = "none";
  
  if($("#rouletteBet").val() == ''){
    handleError("Place a bet");
    return false;
  }
  
  if(document.querySelector("#rouletteBet").value <= 0){
    handleError("Bet must be positive value");
    return false;
  }
  
  if(userCredit <= 0 || document.querySelector("#rouletteBet").value > userCredit){
    handleError("Insufficient Credits");
    return false;
  }
  
  // Flip roullette calculations
  const randNum = Math.floor(Math.random() * 38);
  
  roulettePastResults.push(randNum);
  let tempResults = [];
  
  document.querySelector("#previousResults").innerHTML = "Last 25: ";
  
  let indexTracker = 0;
  for(let j = roulettePastResults.length - 1; j >= 0; j--){
    indexTracker++;
    if(indexTracker > 25){
      break;
    }
    //tempResults.push(roulettePastResults.pop());
    document.querySelector("#previousResults").innerHTML += "<div id='result" + j + "' class='pastResults'>" + rouletteNumbers[roulettePastResults[j]] + "</div>";
    
    document.querySelector("#" + "result" + j + "").style.backgroundColor = rouletteColors[roulettePastResults[j]];
    
    //tempResults.push(roulettePastResults.pop());
  }
  //roulettePastResults = tempResults;
  
  
  
  let addCredit = 0;
  let result;
  
  
  let guess;
  let checkBoxes = document.getElementsByName('roulette');
  
  
  numOfRouletteTrials += 1;
  if(rouletteColors[randNum] == "red"){
   try {
          rouletteResultWins[38] = parseInt(rouletteResultWins[38], 10) + 1;
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
    //rouletteResultPercentages[38] = (rouletteResultWins[38] / numOfRouletteTrials).toFixed(4) * 100;
  }
  else if(rouletteColors[randNum] == "black"){
    
     try {
          rouletteResultWins[39] = parseInt(rouletteResultWins[39], 10) + 1;
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
    //rouletteResultPercentages[39] = (rouletteResultWins[39] / numOfRouletteTrials).toFixed(4) * 100;
  }
  if(rouletteNumbers[randNum] % 2 == 0){
    try {
          rouletteResultWins[40] = parseInt(rouletteResultWins[40], 10) + 1;
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
    //rouletteResultPercentages[40] = (rouletteResultWins[40] / numOfRouletteTrials).toFixed(4) * 100;
  }
  else if(rouletteNumbers[randNum] % 2 == 1){
    try {
          rouletteResultWins[41] = parseInt(rouletteResultWins[41], 10) + 1;
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
    //rouletteResultPercentages[41] = (rouletteResultWins[41] / numOfRouletteTrials).toFixed(4) * 100;
  }
  
  
    try {
      rouletteResultWins[randNum] = parseInt(rouletteResultWins[randNum], 10) + 1;
    } catch (err2) {
      return res.status(400).json({ error: 'Must be a number' });
    }
  

  
  for(let i = 0; i < rouletteResultWins.length; i++){
    rouletteResultPercentages[i] = (rouletteResultWins[i] / numOfRouletteTrials * 100).toFixed(2) ;
  }
  
  console.dir(rouletteResultWins[38]);
  
  for(let i = 0; i < checkBoxes.length; i++){
    
    if(checkBoxes[i].checked){
      if(checkBoxes[i].value == "Red" && rouletteColors[randNum] == "red"){
        //addCredit += document.querySelector("#rouletteBet").value;
          try {
            addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
      
      }
      else if (checkBoxes[i].value == "Black" && rouletteColors[randNum] == "black"){
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
            addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
      
      }
      
      else if (checkBoxes[i].value == "Odd" && rouletteNumbers[randNum] % 2 == 1){
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
            addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
      
      }
      else if (checkBoxes[i].value == "Even" && rouletteNumbers[randNum] != 0 && rouletteNumbers[randNum] % 2 == 0){
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
            addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
      
      }
      else if(checkBoxes[i].value == rouletteNumbers[randNum]){
        //addCredit += document.querySelector("#rouletteBet").value * 35;
        try {
            addCredit += parseInt(document.querySelector("#rouletteBet").value, 10) * 35;
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
      
      }
      else if (rouletteColors[randNum] == "green"){
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
            addCredit -= parseInt(document.querySelector("#rouletteBet").value, 10);
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
      
      }
      else{
        //addCredit -= document.querySelector("#rouletteBet").value;
        try {
            addCredit -= parseInt(document.querySelector("#rouletteBet").value, 10);
          } catch (err2) {
            return res.status(400).json({ error: 'Must be a number' });
          }
      }
      
      
    }

    
  }
  
  /*
  if(result == guess){
    addCredit = document.querySelector("#rouletteBet").value;
  }
  else{
    addCredit = document.querySelector("#rouletteBet").value * -1;
  }
  */
  document.querySelector("#rouletteUpdate").value = addCredit;
  console.dir(addCredit);
  
   if(addCredit > 0){
    document.querySelector("#rouletteWinnings").value = addCredit;
  }
   else{
    document.querySelector("#flipCoinWinnings").value = 0;
  }

  
  
  
  document.querySelector("#rouletteColorBackground").innerHTML = rouletteNumbers[randNum];
  document.querySelector("#rouletteColorBackground").style.backgroundColor = rouletteColors[randNum];
  
  if(addCredit > 0){
    document.querySelector("#rouletteWin").innerHTML = " You won $" + addCredit;
  }
  else if(addCredit < 0){
    let tempCredit = addCredit * -1;
    document.querySelector("#rouletteWin").innerHTML = " You lost $" + tempCredit;
  }
  else{
    document.querySelector("#rouletteWin").innerHTML = " You broke even";
  }
  
  sendAjax('POST', $("#rouletteForm").attr("action"), $("#rouletteForm").serialize(), function() {
    loadUserData();
    loadRoulettePercentages(csrfToken);
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
  
  if($("#input_text").val() == ''){
    handleError("All Fields Necessary");
    return false;
  }
  
  if($("#input_text").val().length > 50){
    handleError("Message must be less than 50 characters");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $("#createMessageForm").attr("action"), $("#createMessageForm").serialize(), function() {
    loadMessagesFromServer();
  });
  
  return false;
  
};


// Home page, add credits
const HomeForm = (props) => {
  return(
    <div id="forms">
        <div className="row">
    <div id="about" className="col s6 center-align offset-s3">
      <p>Thank you for visiting my Online Casino! When the website is fully functional, you will be required to provide payment information, but for now, please feel free to add credits (up to $100000) to test it out. Enjoy!</p>
    </div>
    </div>
    </div>
  );
};

// React call for home page
const showHomeForm = (csrf) => {
  ReactDOM.render(
    <HomeForm csrf={csrf} />,
    document.querySelector("#makeDomo")
  );
};

// Home page, add credits
const CreditForm = (props) => {
  return(
    <div id="forms">
    <div className="row">
    <form id="userCreditForm"
          onSubmit={handleAddCredit}
          name="userCreditForm"
          action="/updateCredit"
          method="POST"
          className="domoForm col s12 m6 l4"
      >
            
            <h2 className="formHead">Add Funds</h2>
        
      
      
      <div className="input-field">
        <input id="domoCreditUpdate" type="number" name="credit" className="validate"/>
        <label >Credits: </label>
      </div>
        
      <div className="input-field">
        <input disabled id="domoCreditUpdate" type="number" name="card" className="validate"/>
      <label >Card Number: </label>
      </div>
      
      <div className="input-field">
        <input disabled id="domoCreditUpdate" type="text" name="name" className="validate"/>
      <label>Name on card: </label>
      </div>
      <div className="input-field">
        <input disabled id="domoCreditUpdate" type="text" name="date" className="validate"/>
      <label>Experation date: </label>
      </div>
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
      <div className="game">
      <div className=" row">
        <div className="col s12 m6 l4">
      <h3 className="gameTitle">Coin Flip</h3>
      <p className="gameRules">Guess heads or tails, place a bet, and flip the coin!</p>
        
      <form id="flipCoinForm"
            onSubmit={flipCoin}
            name="flipCoinForm"
            action="/updateCredit"
            method="POST"
            className="domoForm"
        >
        
          
          <label>
              <input name="coinFlip" className="radio with-gap" type="radio" value="Heads" checked />
              <span>Heads</span>
            </label>
    
          <label> 
              <input name="coinFlip" className="radio with-gap" type="radio" value="Tails"  />
              <span>Tails</span>
            </label>
          
        
        <div className="input-field">
          <input id="coinBet" type="number" min="1" name="bet" className="validate"/>
          <label>Bet: </label>
          </div>
            
          
          <input id="flipCoinUpdate" type="hidden" name="credit" value="-1"/>
          <input id="flipCoinWinnings" type="hidden" name="winnings" value="0"/>
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input className="makeDomoSubmit waves-effect waves-light btn" type="submit" value="Flip Coin" />  
       
        
              <h3 id="flipCoinResult">Result: <h4 id="flipCoinWin"></h4></h3>
        <h4 id="flipCoinWin"></h4>
          
        
      </form>
        
       

        
        </div>
        <div className="col s12 m6 l4 offset-l3 offset-m1">
        
          <img id="coin" src="/assets/img/coin.png" alt="rouletteTable"/>
        </div>
       </div>
      </div>
      
    <div className="game">
      <div className=" row">
      <h3 className="gameTitle">Roulette</h3>
      <p className="gameRules">Guess numbers! (percentage occuring during current session shown next to guesses)</p>
        
      <form id="rouletteForm"
            onSubmit={roulette}
            name="rouletteForm"
            action="/updateCredit"
            method="POST"
            className="domoForm "
        >
        <div className="row">
        <div className="col s12 m7">
          
        
        <div id="rouletteContainer"></div>
        
        </div>
        
        <div className="col s12 m5">
        
          <img id="rouletteTable" src="/assets/img/roulette.png" alt="rouletteTable"/>
        </div>
        </div>
          <div className="row">
          <div className="col s12 m6 l4">
          <div className="input-field">
          <input id="rouletteBet" type="number" min="1" name="bet" className="validate"/>
          <label>Bet: </label>
          </div>
          </div>
             <div className="col s12">
          <input id="rouletteUpdate" type="hidden" name="credit" value="-1"/>
            <input id="rouletteWinnings" type="hidden" name="winnings" value="0"/>
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input className="makeDomoSubmit waves-effect waves-light btn" type="submit" value="Spin Wheel" />
            </div>
            </div>
        
        <div className="row">
      <h3 id="rouletteResult">Result: <h3 id="rouletteColorBackground"></h3><h4 id="rouletteWin"></h4></h3>
         
        <p id="previousResults">Last 25: </p>
          </div>
      </form>
        </div>
      
      
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


const GenerateRoulette = (props) =>{

      return(
        <div>
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="Red" />
          <span>Red ({rouletteResultPercentages[38]}%)</span>
        </label>  
        
        <label>
          <input name="roulette" type="checkbox" value="Black" />
          <span>Black ({rouletteResultPercentages[39]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="Even" />
          <span>Even ({rouletteResultPercentages[40]}%)</span>
        </label>  
        
        <label>
          <input name="roulette" type="checkbox" value="Odd" />
          <span>Odd ({rouletteResultPercentages[41]}%)</span>
        </label>
        </div>
        
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="1" />
          <span>1 ({rouletteResultPercentages[0]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="2" />
          <span>2 ({rouletteResultPercentages[1]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="3" />
          <span>3 ({rouletteResultPercentages[2]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="4" />
          <span>4 ({rouletteResultPercentages[3]}%)</span>
        </label>
          
          
        <label>
          <input name="roulette" type="checkbox" value="5" />
          <span>5 ({rouletteResultPercentages[4]}%)</span>
        </label>
          </div>
          
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="6" />
          <span>6 ({rouletteResultPercentages[5]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="7" />
          <span>7 ({rouletteResultPercentages[6]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="8" />
          <span>8 ({rouletteResultPercentages[7]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="9" />
          <span>9 ({rouletteResultPercentages[8]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="10" />
          <span>10 ({rouletteResultPercentages[9]}%)</span>
        </label>
          </div>
        
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="11" />
          <span>11 ({rouletteResultPercentages[10]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="12" />
          <span>12 ({rouletteResultPercentages[11]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="13" />
          <span>13 ({rouletteResultPercentages[12]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="14" />
          <span>14 ({rouletteResultPercentages[13]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="15" />
          <span>15 ({rouletteResultPercentages[14]}%)</span>
        </label>
        </div>
        
          <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="16" />
          <span>16 ({rouletteResultPercentages[15]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="17" />
          <span>17 ({rouletteResultPercentages[16]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="18" />
          <span>18 ({rouletteResultPercentages[17]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="19" />
          <span>19 ({rouletteResultPercentages[18]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="20" />
          <span>20 ({rouletteResultPercentages[19]}%)</span>
        </label>
        </div>
        
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="21" />
          <span>21 ({rouletteResultPercentages[20]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="22" />
          <span>22 ({rouletteResultPercentages[21]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="23" />
          <span>23 ({rouletteResultPercentages[22]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="24" />
          <span>24 ({rouletteResultPercentages[23]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="25" />
          <span>25 ({rouletteResultPercentages[24]}%)</span>
        </label>
        </div>
        
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="26" />
          <span>26 ({rouletteResultPercentages[25]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="27" />
          <span>27 ({rouletteResultPercentages[26]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="28" />
          <span>28 ({rouletteResultPercentages[27]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="29" />
          <span>29 ({rouletteResultPercentages[28]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="30" />
          <span>30 ({rouletteResultPercentages[29]}%)</span>
        </label>
        </div>
        
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="31" />
          <span>31 ({rouletteResultPercentages[30]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="32" />
          <span>32 ({rouletteResultPercentages[31]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="33" />
          <span>33 ({rouletteResultPercentages[32]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="34" />
          <span>34 ({rouletteResultPercentages[33]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="35" />
          <span>35 ({rouletteResultPercentages[34]}%)</span>
        </label>
        </div>
          
        <div className="row">
        <label>
          <input name="roulette" type="checkbox" value="36" />
          <span>36 ({rouletteResultPercentages[35]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="0" />
          <span>0 ({rouletteResultPercentages[36]}%)</span>
        </label>
        <label>
          <input name="roulette" type="checkbox" value="00" />
          <span>00 ({rouletteResultPercentages[37]}%)</span>
        </label>
        </div>
          </div>
  );
}


// Message page, create messages to post, see other people's messages
const Messages = (props) => {
  return(
    <div>
    <div className="row">
    <h2 className="formHead">Post Messages</h2>
      <p >Tell people about your winnings!</p>
    <form id="createMessageForm"
          onSubmit={handleMessageUpdate}
          name="createMessageForm"
          action="/createMessage"
          method="POST"
          className="messageForm col s12 m6 l4"
      >
    <div className="input-field">
        <input type="hidden" name="name" value={userName} />
    </div> 
    
    <div className="input-field">
      <input id="input_text" type="text" name="text" className="validate" data-length="50"/>
      <label htmlFor="text">Your message:</label>
      
    </div>
      

      
    <div className="input-field">
        <input type="hidden" name="_csrf" value={props.csrf} />
    </div>
    
        <input className="makeDomoSubmit waves-effect waves-light btn" type="submit" value="Post Message" />
    </form>
     </div>
    
    <div id="messages" className="row">
    </div>
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
      <h4 >Total Winnings: ${props.user.winnings}</h4>
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
    <div className="input-field">
    <input id="user" type="hidden" name="username" value={props.user.username}/>
    
    <input id="pass" type="password" name="pass" className="validate"/>
    <label htmlFor="pass">Current Password: </label>
    </div>
    <div className="input-field">
    
   
    <input id="newpass" type="password" name="newpass" className="validate"/>
    <label htmlFor="newpass">New Password: </label>
    </div>
     
    <div className="input-field">
    <input id="newpass2" type="password" name="newpass2" className="validate"/>
    <label htmlFor="newpass2">Retype New Password: </label>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    </div>
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
  
  let newMessageArray = [];
  
  for(let i = props.messages.length - 1; i > props.messages.length - 11; i--){
    newMessageArray.push(props.messages[i]);
    
  }
  
  const messageNodes = newMessageArray.map(function(message) {  
    
    let trimmedDate = message.createdDate.substring(0, 10);
    
    return(
      
      <div key={message._id} className="newMessage">
        <div className="row">
          <div className="col s3">
        <img id="sevens" src="/assets/img/777.png" alt="777" className="messageImage" />
            </div>
          <div className="col s9">
        <h3 className="messageUsername">{message.name}: {message.text}</h3>
            <p className="createdDate">{trimmedDate}</p>
          </div>
          
        </div>
        
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

// Load the user's data

const loadRoulettePercentages = (csrf) => {
    ReactDOM.render(
      <GenerateRoulette csrf={csrf} />,
      document.querySelector("#rouletteContainer")
    );
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

// Home page title
const FundWindow = (props) => {
  return(
    <div>
    <h1 className="pageTitle  center-align">Funds</h1>
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

// React call for home page
const createFundsWindow = (csrf) => {
  ReactDOM.render(
    <FundWindow csrf={csrf} />,
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
  const fundsNav = document.querySelectorAll(".fundsNav");
  const gameNav = document.querySelectorAll(".gameNav");
  const accountNav = document.querySelectorAll(".accountNav");
  const messageNav = document.querySelectorAll(".messageNav");
  
  for(let i = 0; i < homeNav.length; i++){
    homeNav[i].addEventListener("click", (e) =>{
      e.preventDefault();
      createHomeWindow(csrf);

      showHomeForm(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";

      return false;
    });
    
    fundsNav[i].addEventListener("click", (e) =>{
      e.preventDefault();
      createFundsWindow(csrf);

      showAddCredit(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";

      return false;
    });

      gameNav[i].addEventListener("click", (e) =>{
      e.preventDefault();
      //instance.getSelectedValues();
      createGameWindow(csrf);
      showGames(csrf);
      loadRoulettePercentages(csrf);
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
      $('input#input_text').characterCounter();
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";
      return false;
    });
  }
  
  
  
  
  
  
  document.querySelector("#errorBubble").style.opacity = 0;
  document.querySelector("#errorBubble").style.display = "none";
  
  showHomeForm();
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

$(document).ready(function() {
    $('input#input_text').characterCounter();
  });

/*
let elem = document.querySelector('select');
let instance = M.FormSelect.init(elem);
let pluginInstance = M.FormSelect.getInstance(elem);
//instance = M.FormSelect.getInstance(elem);


 $(document).ready(function(){
    $('select').formSelect();
  });
*/

