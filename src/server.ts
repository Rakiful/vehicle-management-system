import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { userRoutes } from "./modules/user/user.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
const app = express();
const port = 7000;

// Middlewares
app.use(express.json());

// Initialize DB
initDB();

app.use("/api/v1", authRoutes);
app.use("/api/v1", vehicleRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Management Server Starts");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: true,
    message: "Route Not Found",
    path: req.path,
  });
});
