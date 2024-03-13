// import seed data files, arrays of objects
const warehouseData = require('../seed-data/warehouses');
const inventoriesData = require('../seed-data/inventories');

exports.seed = async function(knex) {
  await knex('post').del();
  await knex('user').del();
  await knex('user').insert(warehouseData);
  await knex('post').insert(inventoriesData);
};