import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  connection_str: process.env.CONNECTION_STR,
  port: process.env.PORT,
  token_secret: process.env.JWT_SECRET_KEY,
};
console.log("Loaded JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

export default config;
