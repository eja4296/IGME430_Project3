const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
    unique: true,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  credit: {
    type: Number,
    min: 0,
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


DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  credit: doc.credit,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  // Find domo by owner
  const search = {
    owner: convertId(ownerId),
  };
  return DomoModel.find(search).select('name age credit').exec(callback);
};

DomoSchema.statics.findByName = (owner, domoName, callback) => {
  // Find domo by id
  const search = {
    owner: convertId(owner),
    name: domoName,
  };
  return DomoModel.find(search).select('name age credit').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
