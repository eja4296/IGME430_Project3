const models = require('../models');

const Account = models.Account;

// Show Login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Handle user login
const login = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || ! password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/casino' });
  });
};

// Handle new user signup
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      credit: 0,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/casino' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// handle user changing password
const changePass = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  const newPassword = `${req.body.newpass}`;
  const newPassword2 = `${req.body.newpass2}`;

  if (!username || ! password || !newPassword || !newPassword2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newPassword !== newPassword2) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    return Account.AccountModel.generateHash(newPassword, (salt, hash) => {
      account.set('password', hash);
      account.set('salt', salt);

      const savePromise = account.save();

      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(account);
        return res.json({ redirect: '/casino' });
      });

      savePromise.catch((err2) => {
        console.log(err2);

        return res.status(400).json({ error: 'An error occured' });
      });
    });
  });
};

// Get a user
const getUser = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findByUsername(req.session.account.username, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ user });
  });
};

// Update user's credit
const updateCredit = (req, res) =>
Account.AccountModel.findByUsername(req.session.account.username, (err, user) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured' });
  }

  let totalCredit;
  try {
    totalCredit = parseInt(user.credit, 10) + parseInt(req.body.credit, 10);
  } catch (err2) {
    return res.status(400).json({ error: 'Must be a number' });
  }


  if (totalCredit > 100000) {
    return res.status(400).json({ error: 'Exceeds max credits' });
  }

  user.set('credit', totalCredit);
  user.save();

  return res.json({ user });
});

// Get token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.updateCredit = updateCredit;
module.exports.getUser = getUser;
module.exports.getToken = getToken;
module.exports.updateCredit = updateCredit;
module.exports.changePass = changePass;
