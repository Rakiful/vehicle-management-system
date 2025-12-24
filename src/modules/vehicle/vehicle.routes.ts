import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
  "/vehicles",
  auth("admin"),
  vehicleControllers.createVehicle
);
router.get(
  "/vehicles",
  auth("admin", "customer"),
  vehicleControllers.getAllVehicles
);
router.get(
  "/vehicles/:vehicleId",
  auth("admin", "customer"),
  vehicleControllers.getSingleVehicle
);
router.put(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleControllers.updateVehicle
);
router.delete(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleControllers.deleteVehicle
);

export const vehicleRoutes = router;
