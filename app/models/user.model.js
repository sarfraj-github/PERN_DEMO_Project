const sql = require("./db.js");
const bcrypt = require("bcryptjs");

//================= Get All Users Records ================
async function fetchAllUsers() {
  try {
    const result = await sql.query(`SELECT * FROM users`, null);
    // console.log(`result---get--users--> ${JSON.stringify(result.rows)}`);

    if (result.rowCount > 0) {
      return result.rows;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/*............... create new user ................*/
async function createUser(fname, lname, email, password, secPass) {
  try {
    // console.log(`user--data--in--models =======> ${fname} , ${lname} , ${email} , ${password}}`);

    const result = await sql.query(
      `INSERT INTO users(first_name, last_name, email, user_password) values($1, $2, $3, $4)`,
      [fname, lname, email, secPass]
    );
    // console.log(`query result ---> ${JSON.stringify(result)}`);

    if (result.rowCount > 0) {
      return result;
    }
    return null;
  } catch (error) {
    // console.log(`SQL internal error ------> ${error}`);
    throw error;
  }
}

//=========== Fetch by Email for Login =============
async function findUserByEmail(email) {
  try {
    console.log(`User email ---> ${email}`);

    const result = await sql.query(`SELECT * FROM users u WHERE u.email = $1`, [
      email,
    ]);

    // console.log(`result of login =====> ${JSON.stringify(result.rows)}`);

    if (result.rows.length > 0) return result.rows[0];

    return null;
  } catch (error) {
    console.log(`error while user login ---> ${error}`);

    throw error;
  }
}

//============ search by id =============
async function findUserById(id) {
  try {
    console.log("fetchUSer---model---> ", id);
    const result = await sql.query(`SELECT * FROM users WHERE user_id = $1` , [id]);
    
    if (result.rowCount > 0) {
      return result.rows;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchAllUsers,
  createUser,
  findUserByEmail,
  findUserById,
};
