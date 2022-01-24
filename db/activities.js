const client = require('./client');
// const util = require('./util');

async function getAllActivities(){
  try {
    const {rows} = await client.query(`
      SELECT * FROM activities;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getActivityById(id){
  try {
    const {rows: [activity]} = await client.query(`
      SELECT * FROM activities
      WHERE id = $1
    `, [id]);
    return activity;
  } catch (error) {
    throw error;
  }
}
async function getActivityByName(name){
  try {
    const {rows: [activity]} = await client.query(`
      SELECT * FROM activities
      WHERE name = $1
    `, [name]);
    return activity;
  } catch (error) {
    throw error;
  }
}
async function getActivitiesByRoutineId(id) {
  try {
    const { rows: activities } = await client.query(`
    SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId"
    FROM activities 
    JOIN routine_activities ON routine_activities."activityId" = activities.id
    WHERE routine_activities."routineId" = $1;
  `, [id]);
  return activities;
  } catch (error) {
    throw error;
  }
}

async function createActivity({ name, description }){
  try {
    const {rows: [activity]} = await client.query(`
      INSERT INTO activities(name, description) VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING 
      RETURNING *
    `, [name, description]);
    return activity;
  } catch (error) {
    throw error;
  }}

async function updateActivity({id, ...fields}){
  try {
    const toUpdate = {}
    for(let column in fields) {
      console.log('column: ', column);
      if(fields[column] !== undefined) toUpdate[column] = fields[column];
    }
    let activity;
    if (util.dbFields(toUpdate).insert.length > 0) {
      const {rows} = await client.query(`
        UPDATE activities
        SET ${ util.dbFields(toUpdate).insert }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(toUpdate));
      activity = rows[0];
    }
    return activity;
  } catch (error) {
    throw error
  }
}
// don't try to update the id
// do update the name and description
// return the updated activity
module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  getActivitiesByRoutineId,
  createActivity,
  updateActivity,
}