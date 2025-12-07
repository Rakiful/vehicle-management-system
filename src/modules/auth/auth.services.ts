import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import config from "../../config";

const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if ((password as string).length < 6) {
    throw new Error(
      "Please enter a password that is 6 or more characters in length."
    );
  }
  const hashPass = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, (email as string).toLowerCase(), hashPass, phone, role]
  );
  delete result.rows[0].password;
  return result;
};

const signin = async (email: string, password: string) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  );
  if (result.rows.length === 0) {
    throw new Error("User Not Found");
  }
  const user = result.rows[0];
  const matchedPass = await bcrypt.compare(password, user.password);
  if (!matchedPass) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.token_secret as string,
    {
      expiresIn: "7d",
    }
  );

  delete user.password;
  return { token, user };
};

export const authServices = {
  signup,
  signin,
};
