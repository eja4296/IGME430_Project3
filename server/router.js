const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/getMessages', mid.requiresLogin, controllers.Message.getMessages);
  app.get('/getUser', mid.requiresLogin, controllers.Account.getUser);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/casino', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/casino', mid.requiresLogin, controllers.Domo.make);
  app.post('/createMessage', mid.requiresLogin, controllers.Message.createMessage);
  app.post('/updateDomo', mid.requiresLogin, controllers.Domo.updateDomo);
  app.post('/updateCredit', mid.requiresLogin, controllers.Account.updateCredit);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
