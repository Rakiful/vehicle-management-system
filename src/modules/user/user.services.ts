import { Request } from "express";
import { pool } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";

const getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result;
};

const updateUserIntoDB = async (req: Request) => {
  const { name, email, phone, role } = req.body;
  const { id: loggedInUserId, role: loggedInUserRole } = req.user as JwtPayload;

  const targetUserId = req.params.userId;

  if (loggedInUserRole === "customer") {
    if (String(loggedInUserId) !== String(targetUserId)) {
      throw new Error("Forbidden: Customers can update only their own profile");
    }

    const result = await pool.query(
      `
        UPDATE users 
        SET name=$1, email=$2, phone=$3 
        WHERE id=$4 
        RETURNING *
      `,
      [name, email, phone, targetUserId]
    );

    delete result.rows[0].password;
    return result;
  }

  if (loggedInUserRole === "admin") {
    const result = await pool.query(
      `
        UPDATE users 
        SET name=$1, email=$2, phone=$3, role=$4 
        WHERE id=$5 
        RETURNING *
      `,
      [name, email, phone, role, targetUserId]
    );

    delete result.rows[0].password;
    return result;
  }

  throw new Error("Invalid role");
};


const deleteUserFromDB = async (id: string) => {
  const activeBooking = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );
  console.log(activeBooking);
  if (activeBooking.rows.length > 0) {
    throw new Error("User has active bookings. Cannot delete");
  }
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userServices = {
  getAllUsersFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
