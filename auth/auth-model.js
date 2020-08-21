const db = require('../database/dbConfig');

module.exports = {
  add,
  findBy,
};

function add(user) {
  return db('users').insert(user);
}

function findBy(filter) {
  return db('users').where(filter).orderBy('id');
}
