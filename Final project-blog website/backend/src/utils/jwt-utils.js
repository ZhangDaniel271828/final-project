import jwt from "jsonwebtoken";

/**
 * Verifies the JWT and extracts the username. Throws an error if invalid.
 * @param {string} token The token to verify
 */
export function getUsernameFromJWT(token) {
  // Decode token; will throw an error if the token is invalid or expired.
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  if (!decoded.username) throw `JWT is valid but did not contain a username.`;
  return decoded.username;
}

/**
 * Generates a JWT for the user with the given username and expiry (default: 24h).
 * @param {string} username The username
 * @param {string} expiresIn Token expiry time (default: 24h)
 */

export function createUserJWT(username, expiresIn = "24h") {
  return jwt.sign({ username }, process.env.JWT_KEY, { expiresIn });
}
