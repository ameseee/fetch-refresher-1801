exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE hedgehogs(
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT,
    hoglets INTEGER,
    allergies TEXT,
    created_at TIMESTAMP
  )`
  return knex.raw(createQuery);
};

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE hedgehogs`
  return knex.raw(dropQuery);
};
