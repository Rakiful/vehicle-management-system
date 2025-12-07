import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.connection_str,
});

export const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(250) UNIQUE NOT NULL,
        password TEXT CHECK (LENGTH(password) >= 6) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer'))
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY NOT NULL,
        vehicle_name VARCHAR(200) NOT NULL,
        type VARCHAR(20) NOT NULL,
        registration_number VARCHAR(250) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL,
        availability_status VARCHAR(50) NOT NULL
        )
      `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY NOT NULL,
        customer_id INT REFERENCES users(id) NOT NULL,
        vehicle_id INT REFERENCES vehicles(id) NOT NULL,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price INT DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned'))
        )
      `);
};
