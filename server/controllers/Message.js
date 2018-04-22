const models = require('../models');

const Message = models.Message;

// Show message page
const messagePage = (req, res) => {
  Message.MessageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const page = 'home';
    return res.render('app', { csrfToken: req.csrfToken(), messages: docs, page });
  });
};

// Handle creating a new message
const createMessage = (req, res) => {
  if (!req.body.name || !req.body.money || !req.body.game) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const MessageData = {
    name: req.body.name,
    money: req.body.money,
    game: req.body.game,
    owner: req.session.account._id,
  };

  const newMessage = new Message.MessageModel(MessageData);

  const messagePromise = newMessage.save();

  messagePromise.then(() => res.json({ redirect: '/casino' }));

  // Update Domo if it already exists
  messagePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An Error Occured' });
    }

    return res.status(400).json({ error: 'An Error Occured' });
  });

  return messagePromise;
};

// Get all messages to display
const getMessages = (request, response) => {
  const req = request;
  const res = response;

  return Message.MessageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ messages: docs });
  });
};

module.exports.messagePage = messagePage;
module.exports.createMessage = createMessage;
module.exports.getMessages = getMessages;
