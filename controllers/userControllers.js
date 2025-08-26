import User from "../models/userSchema.js";

export const getUser = () => {
  //user.find(id)
};

export const createUser = async (request, response) => {
  const { username, password } = request.body;
  console.log("username: ", username);
  console.log("password", password);

  if (!username || !password) {
    console.log("Error creating user, empty fields!");
    return response.status(400).send("all fields are required!");
  }

  try {
    const newUser = new User({
      username: username,
      password: password,
    });

    await newUser.save();

    console.log("created account: ", username);
    response.send("created account: ", username);
  } catch (error) {
    console.error("Error creating user: ", error.message);
    response.status(500).send("Server error");
  }
};
