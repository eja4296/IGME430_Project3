'use strict';

// Global variables
var csrfToken = void 0;
var userCredit = void 0;
var userName = void 0;

var rouletteColors = ['red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'green', 'green'];
var rouletteNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '0', '00'];

var rouletteResultPercentages = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

var rouletteResultWins = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

var numOfRouletteTrials = 0;

var roulettePastResults = [];

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

  if ($("#coinBet").val() == '') {
    handleError("Place a bet");
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

  var guess = void 0;
  var radioButtons = document.getElementsByName('coinFlip');

  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      guess = radioButtons[i].value;
    }
  }

  if (result == guess) {
    addCredit = document.querySelector("#coinBet").value;
  } else {
    addCredit = document.querySelector("#coinBet").value * -1;
  }

  document.querySelector("#flipCoinUpdate").value = addCredit;

  if (addCredit > 0) {
    document.querySelector("#flipCoinWinnings").value = addCredit;
  } else {
    document.querySelector("#flipCoinWinnings").value = 0;
  }

  document.querySelector("#flipCoinResult").innerHTML = "Result: " + result;

  if (addCredit > 0) {
    document.querySelector("#flipCoinWin").innerHTML = " You won $" + addCredit;
  } else if (addCredit < 0) {
    var tempCredit = addCredit * -1;
    document.querySelector("#flipCoinWin").innerHTML = " You lost $" + tempCredit;
  } else {
    document.querySelector("#flipCoinWin").innerHTML = " You broke even";
  }

  sendAjax('POST', $("#flipCoinForm").attr("action"), $("#flipCoinForm").serialize(), function () {
    loadUserData();
  });

  return false;
};

// Handle Roulette Game
var roulette = function roulette(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#rouletteBet").val() == '') {
    handleError("Place a bet");
    return false;
  }

  if (document.querySelector("#rouletteBet").value <= 0) {
    handleError("Bet must be positive value");
    return false;
  }

  if (userCredit <= 0 || document.querySelector("#rouletteBet").value > userCredit) {
    handleError("Insufficient Credits");
    return false;
  }

  // Flip roullette calculations
  var randNum = Math.floor(Math.random() * 38);

  roulettePastResults.push(randNum);
  var tempResults = [];

  document.querySelector("#previousResults").innerHTML = "Last 25: ";

  var indexTracker = 0;
  for (var j = roulettePastResults.length - 1; j >= 0; j--) {
    indexTracker++;
    if (indexTracker > 25) {
      break;
    }
    //tempResults.push(roulettePastResults.pop());
    document.querySelector("#previousResults").innerHTML += "<div id='result" + j + "' class='pastResults'>" + rouletteNumbers[roulettePastResults[j]] + "</div>";

    document.querySelector("#" + "result" + j + "").style.backgroundColor = rouletteColors[roulettePastResults[j]];

    //tempResults.push(roulettePastResults.pop());
  }
  //roulettePastResults = tempResults;


  var addCredit = 0;
  var result = void 0;

  var guess = void 0;
  var checkBoxes = document.getElementsByName('roulette');

  numOfRouletteTrials += 1;
  if (rouletteColors[randNum] == "red") {
    try {
      rouletteResultWins[38] = parseInt(rouletteResultWins[38], 10) + 1;
    } catch (err2) {
      return res.status(400).json({ error: 'Must be a number' });
    }
    //rouletteResultPercentages[38] = (rouletteResultWins[38] / numOfRouletteTrials).toFixed(4) * 100;
  } else if (rouletteColors[randNum] == "black") {

    try {
      rouletteResultWins[39] = parseInt(rouletteResultWins[39], 10) + 1;
    } catch (err2) {
      return res.status(400).json({ error: 'Must be a number' });
    }
    //rouletteResultPercentages[39] = (rouletteResultWins[39] / numOfRouletteTrials).toFixed(4) * 100;
  }
  if (rouletteNumbers[randNum] % 2 == 0) {
    try {
      rouletteResultWins[40] = parseInt(rouletteResultWins[40], 10) + 1;
    } catch (err2) {
      return res.status(400).json({ error: 'Must be a number' });
    }
    //rouletteResultPercentages[40] = (rouletteResultWins[40] / numOfRouletteTrials).toFixed(4) * 100;
  } else if (rouletteNumbers[randNum] % 2 == 1) {
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

  for (var i = 0; i < rouletteResultWins.length; i++) {
    rouletteResultPercentages[i] = (rouletteResultWins[i] / numOfRouletteTrials * 100).toFixed(2);
  }

  console.dir(rouletteResultWins[38]);

  for (var _i = 0; _i < checkBoxes.length; _i++) {

    if (checkBoxes[_i].checked) {
      if (checkBoxes[_i].value == "Red" && rouletteColors[randNum] == "red") {
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
          addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
        } catch (err2) {
          return res.status(400).json({ error: 'Must be a number' });
        }
      } else if (checkBoxes[_i].value == "Black" && rouletteColors[randNum] == "black") {
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
          addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
        } catch (err2) {
          return res.status(400).json({ error: 'Must be a number' });
        }
      } else if (checkBoxes[_i].value == "Odd" && rouletteNumbers[randNum] % 2 == 1) {
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
          addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
        } catch (err2) {
          return res.status(400).json({ error: 'Must be a number' });
        }
      } else if (checkBoxes[_i].value == "Even" && rouletteNumbers[randNum] != 0 && rouletteNumbers[randNum] % 2 == 0) {
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
          addCredit += parseInt(document.querySelector("#rouletteBet").value, 10);
        } catch (err2) {
          return res.status(400).json({ error: 'Must be a number' });
        }
      } else if (checkBoxes[_i].value == rouletteNumbers[randNum]) {
        //addCredit += document.querySelector("#rouletteBet").value * 35;
        try {
          addCredit += parseInt(document.querySelector("#rouletteBet").value, 10) * 35;
        } catch (err2) {
          return res.status(400).json({ error: 'Must be a number' });
        }
      } else if (rouletteColors[randNum] == "green") {
        //addCredit += document.querySelector("#rouletteBet").value;
        try {
          addCredit -= parseInt(document.querySelector("#rouletteBet").value, 10);
        } catch (err2) {
          return res.status(400).json({ error: 'Must be a number' });
        }
      } else {
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

  if (addCredit > 0) {
    document.querySelector("#rouletteWinnings").value = addCredit;
  } else {
    document.querySelector("#flipCoinWinnings").value = 0;
  }

  document.querySelector("#rouletteColorBackground").innerHTML = rouletteNumbers[randNum];
  document.querySelector("#rouletteColorBackground").style.backgroundColor = rouletteColors[randNum];

  if (addCredit > 0) {
    document.querySelector("#rouletteWin").innerHTML = " You won $" + addCredit;
  } else if (addCredit < 0) {
    var tempCredit = addCredit * -1;
    document.querySelector("#rouletteWin").innerHTML = " You lost $" + tempCredit;
  } else {
    document.querySelector("#rouletteWin").innerHTML = " You broke even";
  }

  sendAjax('POST', $("#rouletteForm").attr("action"), $("#rouletteForm").serialize(), function () {
    loadUserData();
    loadRoulettePercentages(csrfToken);
  });

  return false;
};

// Handle Changing Password
var handleChangePass = function handleChangePass(e) {
  e.preventDefault();

  $("#errorBubble").animate({ opacity: 0 }, 400);
  document.querySelector("#errorBubble").style.display = "none";

  if ($("#pass").val() == '' || $("#newpass").val() == '' || $("#newpass2").val() == '') {
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

  if ($("#input_text").val() == '') {
    handleError("All Fields Necessary");
    return false;
  }

  if ($("#input_text").val().length > 50) {
    handleError("Message must be less than 50 characters");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#createMessageForm").attr("action"), $("#createMessageForm").serialize(), function () {
    loadMessagesFromServer();
  });

  return false;
};

// Home page, add credits
var HomeForm = function HomeForm(props) {
  return React.createElement(
    'div',
    { id: 'forms' },
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { id: 'about', className: 'col s6 center-align offset-s3' },
        React.createElement(
          'p',
          null,
          'Thank you for visiting my Online Casino! When the website is fully functional, you will be required to provide payment information, but for now, please feel free to add credits (up to $100000) to test it out. Enjoy!'
        )
      )
    )
  );
};

// React call for home page
var showHomeForm = function showHomeForm(csrf) {
  ReactDOM.render(React.createElement(HomeForm, { csrf: csrf }), document.querySelector("#makeDomo"));
};

// Home page, add credits
var CreditForm = function CreditForm(props) {
  return React.createElement(
    'div',
    { id: 'forms' },
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'form',
        { id: 'userCreditForm',
          onSubmit: handleAddCredit,
          name: 'userCreditForm',
          action: '/updateCredit',
          method: 'POST',
          className: 'domoForm col s12 m6 l4'
        },
        React.createElement(
          'h2',
          { className: 'formHead' },
          'Add Funds'
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { id: 'domoCreditUpdate', type: 'number', name: 'credit', className: 'validate' }),
          React.createElement(
            'label',
            null,
            'Credits: '
          )
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { disabled: true, id: 'domoCreditUpdate', type: 'number', name: 'card', className: 'validate' }),
          React.createElement(
            'label',
            null,
            'Card Number: '
          )
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { disabled: true, id: 'domoCreditUpdate', type: 'text', name: 'name', className: 'validate' }),
          React.createElement(
            'label',
            null,
            'Name on card: '
          )
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { disabled: true, id: 'domoCreditUpdate', type: 'text', name: 'date', className: 'validate' }),
          React.createElement(
            'label',
            null,
            'Experation date: '
          )
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeDomoSubmit waves-effect waves-light btn', type: 'submit', value: 'Add Funds' })
      )
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
    'div',
    { id: 'games' },
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'h2',
        { className: 'formHead' },
        'Play Games'
      )
    ),
    React.createElement(
      'div',
      { className: 'game' },
      React.createElement(
        'div',
        { className: ' row' },
        React.createElement(
          'div',
          { className: 'col s12 m6 l4' },
          React.createElement(
            'h3',
            { className: 'gameTitle' },
            'Coin Flip'
          ),
          React.createElement(
            'p',
            { className: 'gameRules' },
            'Guess heads or tails, place a bet, and flip the coin!'
          ),
          React.createElement(
            'form',
            { id: 'flipCoinForm',
              onSubmit: flipCoin,
              name: 'flipCoinForm',
              action: '/updateCredit',
              method: 'POST',
              className: 'domoForm'
            },
            React.createElement(
              'label',
              null,
              React.createElement('input', { name: 'coinFlip', className: 'radio with-gap', type: 'radio', value: 'Heads', checked: true }),
              React.createElement(
                'span',
                null,
                'Heads'
              )
            ),
            React.createElement(
              'label',
              null,
              React.createElement('input', { name: 'coinFlip', className: 'radio with-gap', type: 'radio', value: 'Tails' }),
              React.createElement(
                'span',
                null,
                'Tails'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field' },
              React.createElement('input', { id: 'coinBet', type: 'number', min: '1', name: 'bet', className: 'validate' }),
              React.createElement(
                'label',
                null,
                'Bet: '
              )
            ),
            React.createElement('input', { id: 'flipCoinUpdate', type: 'hidden', name: 'credit', value: '-1' }),
            React.createElement('input', { id: 'flipCoinWinnings', type: 'hidden', name: 'winnings', value: '0' }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { className: 'makeDomoSubmit waves-effect waves-light btn', type: 'submit', value: 'Flip Coin' }),
            React.createElement(
              'h3',
              { id: 'flipCoinResult' },
              'Result: ',
              React.createElement('h4', { id: 'flipCoinWin' })
            ),
            React.createElement('h4', { id: 'flipCoinWin' })
          )
        ),
        React.createElement(
          'div',
          { className: 'col s12 m6 l4 offset-l3 offset-m1' },
          React.createElement('img', { id: 'coin', src: '/assets/img/coin.png', alt: 'rouletteTable' })
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'game' },
      React.createElement(
        'div',
        { className: ' row' },
        React.createElement(
          'h3',
          { className: 'gameTitle' },
          'Roulette'
        ),
        React.createElement(
          'p',
          { className: 'gameRules' },
          'Guess numbers! (percentage occuring during current session shown next to guesses)'
        ),
        React.createElement(
          'form',
          { id: 'rouletteForm',
            onSubmit: roulette,
            name: 'rouletteForm',
            action: '/updateCredit',
            method: 'POST',
            className: 'domoForm '
          },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col s12 m7' },
              React.createElement('div', { id: 'rouletteContainer' })
            ),
            React.createElement(
              'div',
              { className: 'col s12 m5' },
              React.createElement('img', { id: 'rouletteTable', src: '/assets/img/roulette.png', alt: 'rouletteTable' })
            )
          ),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col s12 m6 l4' },
              React.createElement(
                'div',
                { className: 'input-field' },
                React.createElement('input', { id: 'rouletteBet', type: 'number', min: '1', name: 'bet', className: 'validate' }),
                React.createElement(
                  'label',
                  null,
                  'Bet: '
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'col s12' },
              React.createElement('input', { id: 'rouletteUpdate', type: 'hidden', name: 'credit', value: '-1' }),
              React.createElement('input', { id: 'rouletteWinnings', type: 'hidden', name: 'winnings', value: '0' }),
              React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
              React.createElement('input', { className: 'makeDomoSubmit waves-effect waves-light btn', type: 'submit', value: 'Spin Wheel' })
            )
          ),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'h3',
              { id: 'rouletteResult' },
              'Result: ',
              React.createElement('h3', { id: 'rouletteColorBackground' }),
              React.createElement('h4', { id: 'rouletteWin' })
            ),
            React.createElement(
              'p',
              { id: 'previousResults' },
              'Last 25: '
            )
          )
        )
      )
    )
  );
};

// React call for game page
var showGames = function showGames(csrf) {
  ReactDOM.render(React.createElement(Games, { csrf: csrf }), document.querySelector("#makeDomo"));
};

var GenerateRoulette = function GenerateRoulette(props) {

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: 'Red' }),
        React.createElement(
          'span',
          null,
          'Red (',
          rouletteResultPercentages[38],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: 'Black' }),
        React.createElement(
          'span',
          null,
          'Black (',
          rouletteResultPercentages[39],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: 'Even' }),
        React.createElement(
          'span',
          null,
          'Even (',
          rouletteResultPercentages[40],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: 'Odd' }),
        React.createElement(
          'span',
          null,
          'Odd (',
          rouletteResultPercentages[41],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '1' }),
        React.createElement(
          'span',
          null,
          '1 (',
          rouletteResultPercentages[0],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '2' }),
        React.createElement(
          'span',
          null,
          '2 (',
          rouletteResultPercentages[1],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '3' }),
        React.createElement(
          'span',
          null,
          '3 (',
          rouletteResultPercentages[2],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '4' }),
        React.createElement(
          'span',
          null,
          '4 (',
          rouletteResultPercentages[3],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '5' }),
        React.createElement(
          'span',
          null,
          '5 (',
          rouletteResultPercentages[4],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '6' }),
        React.createElement(
          'span',
          null,
          '6 (',
          rouletteResultPercentages[5],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '7' }),
        React.createElement(
          'span',
          null,
          '7 (',
          rouletteResultPercentages[6],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '8' }),
        React.createElement(
          'span',
          null,
          '8 (',
          rouletteResultPercentages[7],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '9' }),
        React.createElement(
          'span',
          null,
          '9 (',
          rouletteResultPercentages[8],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '10' }),
        React.createElement(
          'span',
          null,
          '10 (',
          rouletteResultPercentages[9],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '11' }),
        React.createElement(
          'span',
          null,
          '11 (',
          rouletteResultPercentages[10],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '12' }),
        React.createElement(
          'span',
          null,
          '12 (',
          rouletteResultPercentages[11],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '13' }),
        React.createElement(
          'span',
          null,
          '13 (',
          rouletteResultPercentages[12],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '14' }),
        React.createElement(
          'span',
          null,
          '14 (',
          rouletteResultPercentages[13],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '15' }),
        React.createElement(
          'span',
          null,
          '15 (',
          rouletteResultPercentages[14],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '16' }),
        React.createElement(
          'span',
          null,
          '16 (',
          rouletteResultPercentages[15],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '17' }),
        React.createElement(
          'span',
          null,
          '17 (',
          rouletteResultPercentages[16],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '18' }),
        React.createElement(
          'span',
          null,
          '18 (',
          rouletteResultPercentages[17],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '19' }),
        React.createElement(
          'span',
          null,
          '19 (',
          rouletteResultPercentages[18],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '20' }),
        React.createElement(
          'span',
          null,
          '20 (',
          rouletteResultPercentages[19],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '21' }),
        React.createElement(
          'span',
          null,
          '21 (',
          rouletteResultPercentages[20],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '22' }),
        React.createElement(
          'span',
          null,
          '22 (',
          rouletteResultPercentages[21],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '23' }),
        React.createElement(
          'span',
          null,
          '23 (',
          rouletteResultPercentages[22],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '24' }),
        React.createElement(
          'span',
          null,
          '24 (',
          rouletteResultPercentages[23],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '25' }),
        React.createElement(
          'span',
          null,
          '25 (',
          rouletteResultPercentages[24],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '26' }),
        React.createElement(
          'span',
          null,
          '26 (',
          rouletteResultPercentages[25],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '27' }),
        React.createElement(
          'span',
          null,
          '27 (',
          rouletteResultPercentages[26],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '28' }),
        React.createElement(
          'span',
          null,
          '28 (',
          rouletteResultPercentages[27],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '29' }),
        React.createElement(
          'span',
          null,
          '29 (',
          rouletteResultPercentages[28],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '30' }),
        React.createElement(
          'span',
          null,
          '30 (',
          rouletteResultPercentages[29],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '31' }),
        React.createElement(
          'span',
          null,
          '31 (',
          rouletteResultPercentages[30],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '32' }),
        React.createElement(
          'span',
          null,
          '32 (',
          rouletteResultPercentages[31],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '33' }),
        React.createElement(
          'span',
          null,
          '33 (',
          rouletteResultPercentages[32],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '34' }),
        React.createElement(
          'span',
          null,
          '34 (',
          rouletteResultPercentages[33],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '35' }),
        React.createElement(
          'span',
          null,
          '35 (',
          rouletteResultPercentages[34],
          '%)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '36' }),
        React.createElement(
          'span',
          null,
          '36 (',
          rouletteResultPercentages[35],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '0' }),
        React.createElement(
          'span',
          null,
          '0 (',
          rouletteResultPercentages[36],
          '%)'
        )
      ),
      React.createElement(
        'label',
        null,
        React.createElement('input', { name: 'roulette', type: 'checkbox', value: '00' }),
        React.createElement(
          'span',
          null,
          '00 (',
          rouletteResultPercentages[37],
          '%)'
        )
      )
    )
  );
};

// Message page, create messages to post, see other people's messages
var Messages = function Messages(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'h2',
        { className: 'formHead' },
        'Post Messages'
      ),
      React.createElement(
        'p',
        null,
        'Tell people about your winnings!'
      ),
      React.createElement(
        'form',
        { id: 'createMessageForm',
          onSubmit: handleMessageUpdate,
          name: 'createMessageForm',
          action: '/createMessage',
          method: 'POST',
          className: 'messageForm col s12 m6 l4'
        },
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { type: 'hidden', name: 'name', value: userName })
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { id: 'input_text', type: 'text', name: 'text', className: 'validate', 'data-length': '50' }),
          React.createElement(
            'label',
            { htmlFor: 'text' },
            'Your message:'
          )
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf })
        ),
        React.createElement('input', { className: 'makeDomoSubmit waves-effect waves-light btn', type: 'submit', value: 'Post Message' })
      )
    ),
    React.createElement('div', { id: 'messages' })
  );
};

// React call for message page
var showMessage = function showMessage(csrf) {
  ReactDOM.render(React.createElement(Messages, { csrf: csrf }), document.querySelector("#makeDomo"));
};

// Account page, shows account information, change password form
var AccountInfo = function AccountInfo(props) {
  return React.createElement(
    'div',
    { id: 'account' },
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'col s12 m6' },
        React.createElement(
          'h2',
          { className: 'formHead' },
          'Account Information'
        ),
        React.createElement(
          'div',
          { id: 'accountInfo' },
          React.createElement(
            'h4',
            null,
            'Your Username: ',
            props.user.username
          ),
          React.createElement(
            'h4',
            null,
            'Your Credits: $',
            props.user.credit
          ),
          React.createElement(
            'h4',
            null,
            'Total Winnings: $',
            props.user.winnings
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'form',
        { id: 'changePassForm',
          name: 'changePassForm',
          onSubmit: handleChangePass,
          action: '/changePass',
          method: 'POST',
          className: 'mainForm col s12 m6 l4'
        },
        React.createElement(
          'h2',
          null,
          'Change Password'
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { id: 'user', type: 'hidden', name: 'username', value: props.user.username }),
          React.createElement('input', { id: 'pass', type: 'password', name: 'pass', className: 'validate' }),
          React.createElement(
            'label',
            { htmlFor: 'pass' },
            'Current Password: '
          )
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { id: 'newpass', type: 'password', name: 'newpass', className: 'validate' }),
          React.createElement(
            'label',
            { htmlFor: 'newpass' },
            'New Password: '
          )
        ),
        React.createElement(
          'div',
          { className: 'input-field' },
          React.createElement('input', { id: 'newpass2', type: 'password', name: 'newpass2', className: 'validate' }),
          React.createElement(
            'label',
            { htmlFor: 'newpass2' },
            'Retype New Password: '
          ),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf })
        ),
        React.createElement('input', { className: 'formSubmit waves-effect waves-light btn', type: 'submit', value: 'Change Password' })
      )
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
      'div',
      { className: 'messageList' },
      React.createElement(
        'h3',
        { className: 'emptyMessage' },
        'No Messages yet'
      )
    );
  }

  var newMessageArray = [];

  if (props.messages.length > 10) {
    for (var i = props.messages.length - 1; i > props.messages.length - 11; i--) {
      newMessageArray.push(props.messages[i]);
    }
  } else {
    for (var _i2 = props.messages.length - 1; _i2 >= 0; _i2--) {
      newMessageArray.push(props.messages[_i2]);
    }
  }

  console.dir(newMessageArray);

  var messageNodes = newMessageArray.map(function (message) {

    var trimmedDate = message.createdDate.substring(0, 10);

    return React.createElement(
      'div',
      { key: message._id, className: 'newMessage' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col s12 m6 l4' },
          React.createElement('img', { id: 'sevens', src: '/assets/img/777.png', alt: '777', className: 'messageImage' })
        ),
        React.createElement(
          'div',
          { className: 'col s12 m6 l8' },
          React.createElement(
            'h3',
            { className: 'messageUsername' },
            message.name,
            ': ',
            message.text
          ),
          React.createElement(
            'p',
            { className: 'createdDate' },
            trimmedDate
          )
        )
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'messageList' },
    messageNodes
  );
};

// Display user information on the page, and as it updates
var UserInfo = function UserInfo(props) {
  userCredit = props.user.credit;
  userName = props.user.username;
  return React.createElement(
    'div',
    { className: 'userStuff' },
    React.createElement(
      'h4',
      { id: 'welcome' },
      'Welcome: ',
      props.user.username
    ),
    React.createElement(
      'h4',
      { id: 'credits' },
      'Credits: $',
      props.user.credit
    )
  );
};

// Load the user's data
var loadUserData = function loadUserData(props) {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render(React.createElement(UserInfo, { user: data.user }), document.querySelector("#userInfo"));
  });
};

// Load the user's data

var loadRoulettePercentages = function loadRoulettePercentages(csrf) {
  ReactDOM.render(React.createElement(GenerateRoulette, { csrf: csrf }), document.querySelector("#rouletteContainer"));
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
    'div',
    null,
    React.createElement(
      'h1',
      { className: 'pageTitle  center-align' },
      'Home'
    )
  );
};

// Home page title
var FundWindow = function FundWindow(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      { className: 'pageTitle  center-align' },
      'Funds'
    )
  );
};

// Game page title
var GameWindow = function GameWindow(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      { className: 'pageTitle  center-align' },
      'Games'
    )
  );
};

// Message page title
var MessageWindow = function MessageWindow(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      { className: 'pageTitle  center-align' },
      'Messages'
    )
  );
};

// Account page title
var AccountWindow = function AccountWindow(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      { className: 'pageTitle  center-align' },
      'Account'
    )
  );
};

// React call for home page
var createHomeWindow = function createHomeWindow(csrf) {
  ReactDOM.render(React.createElement(HomeWindow, { csrf: csrf }), document.querySelector("#pageInfo"));
};

// React call for home page
var createFundsWindow = function createFundsWindow(csrf) {
  ReactDOM.render(React.createElement(FundWindow, { csrf: csrf }), document.querySelector("#pageInfo"));
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
  var homeNav = document.querySelectorAll(".homeNav");
  var fundsNav = document.querySelectorAll(".fundsNav");
  var gameNav = document.querySelectorAll(".gameNav");
  var accountNav = document.querySelectorAll(".accountNav");
  var messageNav = document.querySelectorAll(".messageNav");

  var homeFundsNav = document.querySelectorAll(".homeFundsNav");
  var homeGameNav = document.querySelectorAll(".homeGameNav");
  var homeAccountNav = document.querySelectorAll(".homeAccountNav");
  var homeMessageNav = document.querySelectorAll(".homeMessageNav");

  for (var i = 0; i < homeNav.length; i++) {
    homeNav[i].addEventListener("click", function (e) {
      e.preventDefault();
      createHomeWindow(csrf);

      showHomeForm(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";

      return false;
    });

    fundsNav[i].addEventListener("click", function (e) {
      e.preventDefault();
      createFundsWindow(csrf);

      showAddCredit(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";

      return false;
    });

    gameNav[i].addEventListener("click", function (e) {
      e.preventDefault();
      //instance.getSelectedValues();
      createGameWindow(csrf);
      showGames(csrf);
      loadRoulettePercentages(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";

      return false;
    });

    accountNav[i].addEventListener("click", function (e) {
      e.preventDefault();
      createAccountWindow(csrf);
      showAccountInfo(csrf);
      document.querySelector("#errorBubble").style.opacity = 0;
      document.querySelector("#errorBubble").style.display = "none";
      return false;
    });

    messageNav[i].addEventListener("click", function (e) {
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

  // For home Nav
  homeFundsNav[0].addEventListener("click", function (e) {
    e.preventDefault();
    createFundsWindow(csrf);

    showAddCredit(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";

    return false;
  });

  homeGameNav[0].addEventListener("click", function (e) {
    e.preventDefault();
    //instance.getSelectedValues();
    createGameWindow(csrf);
    showGames(csrf);
    loadRoulettePercentages(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";

    return false;
  });

  homeAccountNav[0].addEventListener("click", function (e) {
    e.preventDefault();
    createAccountWindow(csrf);
    showAccountInfo(csrf);
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });

  homeMessageNav[0].addEventListener("click", function (e) {
    e.preventDefault();

    createMessageWindow(csrf);
    showMessage(csrf);
    loadMessagesFromServer();
    $('input#input_text').characterCounter();
    document.querySelector("#errorBubble").style.opacity = 0;
    document.querySelector("#errorBubble").style.display = "none";
    return false;
  });

  document.querySelector("#errorBubble").style.opacity = 0;
  document.querySelector("#errorBubble").style.display = "none";

  showHomeForm();
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

$(document).ready(function () {
  $('.sidenav').sidenav();
});

$(document).ready(function () {
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
