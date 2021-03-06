const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let MessageModel = {};

// const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// Message has a name, money won, game played, owner (user who created it), and create date
const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    set: setName,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    red: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  text: doc.text,
});

// Finds all messages in database
MessageSchema.statics.findByOwner = (ownerId, callback) => {
  // Find messages by owner
  const search = {
    // owner: convertId(ownerId),
  };
  return MessageModel.find(search).select('name text createdDate').exec(callback);
};

MessageModel = mongoose.model('Message', MessageSchema);
module.exports.MessageModel = MessageModel;
module.exports.MessageSchema = MessageSchema;
