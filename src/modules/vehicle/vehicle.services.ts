import { pool } from "../../config/db";

const createVehicleIntoDB = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price,availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getAllVehiclesFromDB = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const getSingleVehicleFromDB = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  return result;
};

const updateVehicleIntoDB = async (
  payload: Record<string, unknown>,
  id: string
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `
        UPDATE vehicles SET vehicle_name=$1 , type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};

const deleteVehicleFromDB = async (id: string) => {
  const vehicleExistsQuery = await pool.query(
    `SELECT id FROM vehicles WHERE id=$1`,
    [id]
  );

  if (vehicleExistsQuery.rows.length === 0) {
    return "Vehicle not found";
  }

  const activeBookingsQuery = await pool.query(
    `SELECT id FROM bookings WHERE vehicle_id=$1`,
    [id]
  );

  console.log(activeBookingsQuery);

  if (activeBookingsQuery.rows.length > 0) {
    return "Vehicle has active bookings and cannot be deleted";
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id=$1 RETURNING id`,
    [id]
  );

  return result;
};

export const vehicleServices = {
  createVehicleIntoDB,
  getAllVehiclesFromDB,
  getSingleVehicleFromDB,
  updateVehicleIntoDB,
  deleteVehicleFromDB,
};
