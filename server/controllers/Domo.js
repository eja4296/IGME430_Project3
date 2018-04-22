const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const page = 'home';
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs, page });
  });
};


const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.credit) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    credit: req.body.credit,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  // Update Domo if it already exists
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An Error Occured' });
    }

    return res.status(400).json({ error: 'Domo already exists' });
  });

  return domoPromise;
};

// Get all domos
const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

// Update domo
const updateDomo = (req, res) => {
  console.dir(req.body);
  return Domo.DomoModel.findByName(req.session.account._id, req.body.name, (err, domo) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    const totalCredit = parseInt(domo[0].credit, 10) + parseInt(req.body.credit, 10);
    domo[0].set('credit', totalCredit);
    domo[0].save();

    return res.json({ domo: domo[0] });
  });
};


module.exports.makerPage = makerPage;
// module.exports.gamePage = gamePage;
// module.exports.accountPage = accountPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.updateDomo = updateDomo;
