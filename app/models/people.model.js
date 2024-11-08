const sql = require("./db.js");

//================== Get All Peoples Data =================
async function getAllPeopleRecords() {
  try {
    const result = await sql.query(`SELECT * FROM peoples;`, null);
    // console.log(`peoples--Data---> ${JSON.stringify(result)}`);
    if (result.rowCount > 0) {
      return result;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

//================= Create New People ================
async function createNewPeople(peopleData) {
  try {
    console.log("peopleData--model---> " , peopleData);
    
    let query = `INSERT INTO peoples(first_name , last_name , gender , age , address) values($1, $2, $3, $4 , $5)`;
    const result = sql.query(query, [
      peopleData.furstname,
      peopleData.lastname,
      peopleData.gender,
      peopleData.age,
      peopleData.address,
    ]);

    if (result) {
        return result;
    }
    return null;

  } catch (error) {
    throw error;
  }
}

//============ Update a particuler People Record ============
async function updatePeopleRecord(pData, pid) {
  try {
    // console.log(`update--peopel--id---> ${pid}`);
    // console.log(`update--peopel--body---> ${JSON.stringify(pData)}`);
    
    let query = `UPDATE peoples SET full_name = $1 , gender = $2 , age = $3 , address = $4 WHERE pid = $5`;
    const result = await sql.query(query, [
      pData.fullname,
      pData.gender,
      pData.age,
      pData.address,
      pid,
    ]);
    // console.log(`After---Update---> ${JSON.stringify(result)}`);
    
    if (result.rowCount > 0) {
      return { result: "Record Update Successfull....!!!!" };
    }
    return null;
  } catch (error) {
    console.log(`update---error---> ${error}`);
    throw error;
  }
}

//============= Delete a particuler People's Data ============
async function deleteRecordById(pid) {
  try {
    console.log(`people-Id--delete--> ${pid}`);
    
    const result = await sql.query("DELETE FROM peoples WHERE pid = $1", [pid]);
    console.log(`result--delete--> ${result}`);
    
    if (result.rowCount > 0) {
      return {
        message: "Record Delete Successfully.....!!!!",
      };
    }
    return null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllPeopleRecords,
  createNewPeople,
  updatePeopleRecord,
  deleteRecordById,
};
