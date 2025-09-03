import User from "../models/userSchema.js";
import { hashPassword, comparePassword } from "../middleware/bcrypt.js";
import { signJwt, checkJwt } from "../middleware/jwt.js";

// function for registering user
export const createUser = async (request, response) => {
  const { username, password1, password2 } = request.body;
  console.log("username: ", username);
  console.log("password", password1);

  if (!username || !password1 || !password2) {
    console.log("Error creating user, empty fields!");
    return response.status(400).send("all fields are required!");
  }

  if (password1 !== password2) {
    console.log("password do not match!");
    return response.status(400).send("passwords do not match!");
  }

  if (password1.length < 6) {
    return response.status(400).send("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ username }).exec();

  if (existingUser) {
    return response.status(409).send("Username already taken");
  }

  try {
    const hashedPassword = await hashPassword(password1);
    console.log("hashed password: ", hashedPassword);

    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("created account: ", username);
    response.send(`created account: ${username}`);
  } catch (error) {
    console.error("Error creating user: ", error.message);
    response.status(500).send("Server error");
  }
};

// function for user login
export const loginUser = async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).send("incorrect username or password");
  }

  const user = await User.findOne({ username: username }).exec();
  console.log("user:", user);
  console.log("trying to log in user: ", user.username);

  if (!user) {
    return response.status(400).send("incorrect username or password");
  }

  const isCorrectPassword = await comparePassword(password, user.password);

  if (!isCorrectPassword) {
    console.log("incorrect username or password");
    return response.status(400).send("incorrect username or password");
  }

  const accessToken = signJwt(user.username, user._id);
  console.log("accestoken: ", accessToken);

  return response.send(`Logged in as: ${user.username}`);
};
