import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";

export const signJwt = (username, userId, email, rank) => {
  const user = { username: username, userId: userId, email: email, rank: rank };
  const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });

  return accessToken;
};

export const checkJwt = (request, response, next) => {
  const token = request.cookies.token;

  if (!token) {
    return response.status(400).json({ message: "Invalid token" });
  }

  console.log("jwt: ", token);

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    console.log("verified token: ", verified);

    request.user = verified;

    next();
  } catch (error) {
    console.log("jwt verification error");
    return response.status(401).send("jwt verification error");
  }
};
