import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return passwordHash;
};

export const comparePassword = async (password, hash) => {
  const isCorrectPassword = await bcrypt.compare(password, hash);

  return isCorrectPassword;
};
