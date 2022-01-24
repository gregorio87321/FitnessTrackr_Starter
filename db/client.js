// build and export your unconnected client here

require('dotenv').config()
const { Client } = require('pg');
const { pgpassword, pgusername } = process.env
console.log(pgpassword, pgusername)
// supply the db name and location of the database
const client = new Client(process.env.DATABASE_URL || `postgres://${pgusername}:${pgpassword}@localhost:5432/fitness-dev`);


module.exports = client



