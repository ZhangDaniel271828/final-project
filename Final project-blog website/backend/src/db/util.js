export async function updateDatabase(db, tableName, updateData, id, idColumn = "id") {
  const updateOperations = [];
  const updateParams = [];

  // Build update statement based on props in supplied updateData object.
  for (const prop in updateData) {
    const value = updateData[prop];
    updateOperations.push(`${prop} = ?`);
    updateParams.push(value);
  }

  // Build actual SQL statement
  const sql = `UPDATE ${tableName} SET ${updateOperations.join(", ")} WHERE ${idColumn} = ?`;

  console.log(sql);

  // Execute update and return result
  const dbResult = await db.run(sql, ...updateParams, parseInt(id));
  return dbResult;
}
