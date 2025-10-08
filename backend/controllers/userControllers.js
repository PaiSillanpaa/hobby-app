import User from "../models/userSchema.js";
import History from "../models/historySchema.js";
import Favourites from "../models/favouritesSchema.js";
import { hashPassword, comparePassword } from "../middleware/bcrypt.js";
import { signJwt, checkJwt } from "../middleware/jwt.js";

// function for registering user
export const createUser = async (request, response) => {
  const { email, username, password1, password2, rank } = request.body;
  console.log("password: ", password1);

  if (!email || !username || !password1 || !password2 || !rank) {
    console.log("Error creating user, empty fields!");
    return response.status(400).json({ message: "all fields are required!" });
  }

  if (password1 !== password2) {
    console.log("password do not match!");
    return response.status(400).json({ message: "passwords do not match!" });
  }

  if (password1.length < 6) {
    return response
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (rank !== "company" && rank !== "user" && rank !== "admin") {
    return response.status(403).json({ message: "unauthorized" });
  }

  try {
    const existingUser = await User.findOne({ username }).exec();

    if (existingUser) {
      return response.status(409).json({ message: "Username already taken" });
    }

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
    return response
      .status(201)
      .json({ message: `created account: ${username}` });
  } catch (error) {
    console.error("Error creating user: ", error.message);
    return response.status(500).json({ message: "Server error" });
  }
};

// function for user login
export const loginUser = async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response
      .status(400)
      .json({ message: "Please enter both username and password" });
  }

  try {
    const user = await User.findOne({ username: username }).exec();
    console.log("user:", user);

    if (!user) {
      return response
        .status(400)
        .json({ message: "incorrect username or password" });
    }
    console.log("trying to log in user: ", user.username);

    const isCorrectPassword = await comparePassword(password, user.password);

    if (!isCorrectPassword) {
      console.log("incorrect username or password");
      return response
        .status(401)
        .json({ message: "incorrect username or password" });
    }

    const accessToken = signJwt(user.username, user._id, user.email, user.rank);
    console.log("accestoken: ", accessToken);

    response.cookie("token", accessToken, {
      httpOnly: true, // Prevent access from JS
      sameSite: "strict", // Prevent CSRF
      secure: false, // false = http, true = https
      maxAge: 1000 * 60 * 60 * 1, // 1 hour
    });

    console.log("after cookies");

    return response.status(200).json({
      message: "Login successful",
      username: user.username,
      rank: user.rank,
    });
  } catch (error) {
    return response.status(500).json({ message: "error when logging in user" });
  }
};

export const deleteUser = async (request, response) => {
  const { id } = request.params;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ message: "Authentication required" });
  }

  if (!id) return response.status(400).json({ message: "User Id is required" });

  try {
    const currentUser = await User.findOne({ _id: user.userId });

    if (!currentUser) {
      return response
        .status(403)
        .json({ message: "User not found or unauthorized" });
    }

    if (currentUser.rank !== "admin" && !currentUser._id.equals(id)) {
      return response
        .status(403)
        .json({ message: "You do not have permission to delete this user" });
    }

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return response.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: id });
    return response.status(200).json({ message: "User deleted succesfully" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Server error when deleting user" });
  }
};

export const changePassword = async (request, response) => {
  const { currentPassword, newPassword1, newPassword2 } = request.body;

  const { userId } = request.user;
  console.log(typeof userId);

  try {
    const user = await User.findOne({ _id: userId });

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

    const newHashedPassword = await hashPassword(newPassword1);

    await User.findOneAndUpdate(
      { _id: user._id },
      { password: newHashedPassword }
    );

    return response
      .status(200)
      .json({ message: "password changed successfully" });
  } catch (error) {
    return response.status(500).json({ error: "server error" });
  }
};

export const getUserInfo = async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(403).json({ message: "unauthorized" });
  }

  return response.status(200).json({
    userId: user.userId,
    username: user.username,
    email: user.email,
    rank: user.rank,
  });
};

export const updateUser = async (request, response) => {
  const { newUsername, newEmail, newRank } = request.body;
  console.log(newUsername, newEmail, newRank)
  const id = request.params.id;
  const user = request.user;

  if (!user || user.rank !== "admin") {
    return response
      .status(403)
      .json({ message: "unauthorized to update user" });
  }

  try {
    const currentUser = await User.findOne({ _id: id });
    if (!currentUser) {
      return response.status(404).json({ message: "Could not find user" });
    }

    let shouldSave = false;

    if (newUsername?.trim()) {
      currentUser.username = newUsername.trim();
      shouldSave = true;
    }

    if (newEmail?.trim()) {
      currentUser.email = newEmail.trim();
      shouldSave = true;
    }

    if (newRank?.trim()) {
      if (
        newRank.toLowerCase() === "admin" ||
        newRank.toLowerCase() === "company" ||
        newRank.toLowerCase() === "user"
      ) {
        currentUser.rank = newRank.trim();
        shouldSave = true;
      }
    }

    if (shouldSave) {
      await currentUser.save();
      return response
        .status(200)
        .json({ message: "User updated successfully" });
    } else {
      return response
        .status(400)
        .json({ message: "No valid fields to update" });
    }
  } catch (error) {
    return response.status(500).json({ message: "error when updating user" });
  }
};

export const getUsers = async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(403).json({ message: "Unauthorized" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response.status(400).json({ message: "Could not find user" });
    }

    if (currentUser.rank !== "admin") {
      return response
        .status(403)
        .json({ message: "Unauthorized to get users" });
    }

    const users = await User.find({}).select("-password -__v");

    return response.status(200).json({ users });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Error when retrieving users" });
  }
};

export const logoutUser = async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(403).json({ message: "Unauthorized" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response
        .status(401)
        .json({ message: "User not found or Forbidden" });
    }

    response.cookie("token", "", {
      httpOnly: true, // unaccessable for js
      secure: false, // false = http, true = https
      sameSite: "strict",
      expires: new Date(0), // expires now
    });

    return response.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Error when logging out user" });
  }
};
