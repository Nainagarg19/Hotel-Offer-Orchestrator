import express from "express";
import type { Request, Response } from "express";
import { supplierAHotels } from "./suppliers/supplierA.js";
import { supplierBHotels } from "./suppliers/supplierB.js";
import { filterHotelsByCity } from "./suppliers/filterByCity.js";
import { checkSuppliersHealth } from "./suppliers/checkSuppliersHealth.js";
import hotelRoutes from "./routes/hotelRoutes.js";

const app = express();
app.use(express.json());

app.get("/health", async (_req: Request, res: Response) => {
  const suppliers = await checkSuppliersHealth();
  const allOk = suppliers.supplierA.ok && suppliers.supplierB.ok;
  res.status(allOk ? 200 : 503).json({
    status: allOk ? "ok" : "degraded",
    suppliers,
  });
});

app.get("/supplierA/hotels", (req: Request, res: Response) => {
  const city = req.query.city;
  if (typeof city !== "string" || !city.trim()) {
    res.status(400).json({ error: "city query param is required" });
    return;
  }
  res.json(filterHotelsByCity(supplierAHotels, city));
});

app.get("/supplierB/hotels", (req: Request, res: Response) => {
  const city = req.query.city;
  if (typeof city !== "string" || !city.trim()) {
    res.status(400).json({ error: "city query param is required" });
    return;
  }
  res.json(filterHotelsByCity(supplierBHotels, city));
});

app.use(hotelRoutes);

export default app;
