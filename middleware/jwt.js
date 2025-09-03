import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";

export const signJwt = (username, userId) => {
  const user = { name: username, userId: userId };
  const accessToken = jwt.sign(user, SECRET_KEY);

  return accessToken;
};

export const checkJwt = (request, response, next) => {
  const { authorization } = request.headers;
  console.log("jwt: ", authorization);

  if (!authorization || !authorization.startsWith("Bearer")) {
    return response.status(401).send("Missing or invalid token");
  }

  const token = authorization.split(" ")[1];
  console.log("cleaned jwt: ", token);

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    console.log("verified token: ", verified);

    request.user = verified;

    next();
  } catch (error) {
    console.log("jwt verification erro");
    return response.status(401).send("jwt verification error");
  }
};
