import User from "../models/userSchema.js";
import History from "../models/historySchema.js";
import Favourites from "../models/favouritesSchema.js";
import { hashPassword, comparePassword } from "../middleware/bcrypt.js";
import { signJwt, checkJwt } from "../middleware/jwt.js";

// function for registering user
export const createUser = async (request, response) => {
  const { email, username, password1, password2, rank } = request.body;
  console.log("password: ", password1);

  if (!email || !username || !password1 || !password2) {
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
      email: email,
      username: username,
      password: hashedPassword,
      rank: rank,
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
    return response.status(400).send("Please enter both username and password");
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

export const deleteUser = async (request, response) => {
  const { username } = request.body;

  try {
    await User.deleteOne({ username: username });
    return response.status(201).send("User deleted succesfully");
  } catch (error) {
    return response.status(500).send(`Error deleting user: ${error}`);
  }
};

export const changePassword = async (request, response) => {
  const { username, currentPassword, newPassword1, newPassword2 } =
    request.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const isCorrectPassword = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isCorrectPassword) {
      return response.status(401).json({ message: "Incorrect password!" });
    }

    if (newPassword1 !== newPassword2) {
      return response.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await hashPassword(newPassword1);

    await User.findOneAndUpdate(
      { username: username },
      { password: hashedPassword }
    );

    return response
      .status(201)
      .json({ message: "password changed successfully" });
  } catch (error) {
    return response.status(500).json({ error: "server error" });
  }
};
