import yup from "yup";
import { getDatabase } from "./database.js";
import { updateDatabase } from "./util.js";

/**
 * Gets the user with the given username, if it exists.
 *
 * @param {string} username the username to search
 * @returns the user with the matching username, or undefined.
 */
export async function getUserWithUsername(username) {
  const db = await getDatabase();
  return await db.get("SELECT * from Users WHERE username = ?", username);
}

/**
 * Gets the user with the given username and password, if it exists.
 *
 * @param {string} username the username to search
 * @param {*} password the password to search
 * @returns the user with the given credentials, or undefined.
 */
export async function getUserWithCredentials(username, password) {
  const db = await getDatabase();
  return await db.get(
    "SELECT * from Users WHERE username = ? AND password = ?",
    username,
    password
  );
}

/**
 * Schema for "update user". We can optionally supply a first name, last name, password, and / or blurb. We cannot edit the id or username,
 * or supply any other random data.
 */
const updateUserSchema = yup
  .object({
    firstName: yup.string().min(1).optional(),
    lastName: yup.string().min(1).optional(),
    password: yup.string().min(5).optional(),
    blurb: yup.string().optional()
  })
  .required();

/**
 * Updates the user with the given id if it exists, with the given update data. Update data can optionally include a firstName, lastName,
 * password, and / or blurb.
 *
 * @param {*} id the user id to update, will be converted to a number using parseInt().
 * @param {*} udpateData the update data to apply.
 * @returns true if the database was updated, false otherwise
 * @throws an error if updateData is invalid.
 */
export async function updateUser(id, udpateData) {
  // Validate incoming data (throw error if invalid)
  const parsedUpdateData = updateUserSchema.validateSync(udpateData, {
    abortEarly: false,
    stripUnknown: true
  });

  // Build and run update statement
  const db = await getDatabase();
  const dbResult = await updateDatabase(db, "Users", parsedUpdateData, id);

  // Return true if changes applied, false otherwise
  return dbResult.changes > 0;
}
