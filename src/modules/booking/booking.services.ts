import { pool } from "../../config/db";

const createBookingIntoDB = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status === "unavailable") {
    throw new Error("Vehicle is not available for booking");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    throw new Error("Invalid rent dates");
  }

  const total_price = days * vehicle.daily_rent_price;

  const bookingInsert = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = bookingInsert.rows[0];

  await pool.query(
    `UPDATE vehicles SET availability_status='unavailable' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookingFromDB = async (role: string, userId: number) => {
  if (role === "admin") {
    const result = await pool.query(`
            SELECT 
                b.*, 
                u.name AS customer_name,
                u.email AS customer_email,
                v.vehicle_name,
                v.registration_number,
                v.daily_rent_price
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
        `);

    // Mapping desired format
    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  }

  const result = await pool.query(
    `
        SELECT 
            b.*, 
            v.vehicle_name,
            v.registration_number,
            v.type,
            v.daily_rent_price
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

type BookingUpdateResponse = {
  message: string;
  data: any;
};

const updateBookingIntoDB = async (
  role: string,
  bookingId: string,
  status: string
): Promise<BookingUpdateResponse> => {
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );
  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }
  const booking = bookingResult.rows[0];
  if (role === "customer") {
    if (status !== "cancelled") {
      throw new Error("Customer can only cancel booking");
    }

    const updateResult = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    return {
      message: "Booking cancelled successfully",
      data: updateResult.rows[0],
    };
  }
  if (role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark booking as returned");
    }

    const updateResult = await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: updateResult.rows[0],
    };
  }
  throw new Error("Invalid role");
};

export const bookingServices = {
  createBookingIntoDB,
  getAllBookingFromDB,
  updateBookingIntoDB,
};
