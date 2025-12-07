import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBookingIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const getAllBooking = async (req: Request, res: Response) => {
  try {
    const { role, id } = req.user as JwtPayload;
    const result = await bookingServices.getAllBookingFromDB(role, id);

    if (role === "admin") {
      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

const updateBookingIntoDB = async (req: Request, res: Response) => {
  try {
    const { role } = req.user as JwtPayload;
    const { status } = req.body;

    const result = await bookingServices.updateBookingIntoDB(
      role,
      req.params.bookingId as string,
      status
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBooking,
  updateBookingIntoDB,
};
