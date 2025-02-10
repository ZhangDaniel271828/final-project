import yup from "yup";
import { getDatabase } from "./database.js";
import { updateDatabase } from "./util.js";



//For ordinary user

export async function getUserWithUsername(username) {
  const db = await getDatabase();
  return await db.get("SELECT * from Users WHERE username = ?", username);
}
export async function getUserWithCredentials(username, password) {
  const db = await getDatabase();
  // 查询数据库中的用户数据
  const user = await db.get(
    "SELECT * FROM Users WHERE username = ?",
    username
  );

  // 如果用户不存在或者密码验证失败，返回 null
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  return user;
}
const updateUserSchema = yup
  .object({
    username: yup.string().min(3).optional(),
    password: yup.string().min(5).optional(),
    realName: yup.string().min(1).optional(),
    birthDate: yup.string().min(2).optional(),
    blurb: yup.string().optional()
  })
  .required();
export async function updateUser(id, udpateData) {
  // Validate incoming data (throw error if invalid)
  
  const parsedUpdateData = updateUserSchema.validateSync(udpateData, {
    abortEarly: false,
    stripUnknown: true
  });
 
  console.log(parsedUpdateData);
  // Build and run update statement
  const db = await getDatabase();
  const dbResult = await updateDatabase(db, "Users", parsedUpdateData, id);
 
  // Return true if changes applied, false otherwise
  return dbResult.changes > 0;
}
export async function createUser(userData) {
<<<<<<< HEAD
  const db = await getDatabase();
  return await db.run(
    "INSERT INTO Users (username, password, realName, birthDate, blurb) VALUES (?, ?, ?, ?, ?)",
=======
  console.log("createUser function");
  const db = await getDatabase();
  console.log("1");
  const dbResult = await db.run(
    "INSERT INTO Users (username, password, realName, birthDate, blurb, isManager) VALUES (?, ?, ?, ?, ?, ?)",
>>>>>>> dbce1d6e4e352073ac824cebda5fbabeca4be15a
    userData.username,
    userData.password,
    userData.realName,
    userData.birthDate,
<<<<<<< HEAD
    userData.blurb
  );
}
=======
    userData.blurb,
    0
  );
}



// For manamger
// get all users
export async function getAllusers(){
  const db = await getDatabase();
  const allUsers = await db.all("SELECT * FROM Users");
  return allUsers;
}

// delete users based on id
export async function deleteUserById(id) {
  const db = await getDatabase();
  const result = await db.run("DELETE FROM Users WHERE id = ?", id);
  return result.changes; 
}

export async function getUserWithId(id) {
  const db = await getDatabase();
  return await db.get("SELECT * from Users WHERE id = ?", id);
}
>>>>>>> dbce1d6e4e352073ac824cebda5fbabeca4be15a
