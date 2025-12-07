import { Router } from "express";
import { auth } from "../../middleware/auth";
import { bookingControllers } from "./booking.controllers";

const router = Router();

router.post(
  "/bookings",
  auth("admin", "customer"),
  bookingControllers.createBooking
);
router.get(
  "/bookings",
  auth("admin", "customer"),
  bookingControllers.getAllBooking
);
router.put(
  "/bookings/:bookingId",
  auth("admin", "customer"),
  bookingControllers.updateBookingIntoDB
);

export const bookingRoutes = router;
