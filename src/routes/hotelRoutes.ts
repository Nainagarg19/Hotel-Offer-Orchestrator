import { Router } from "express";
import { executeHotelWorkflow } from "../temporal/client.js";
import { getHotelsFilteredByPriceInRedis, persistDedupedHotels } from "../redis/hotelDedupeStore.js";

const hotelRoutes = Router();

function parseOptionalPriceQuery(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

hotelRoutes.get("/api/hotels", async (req, res) => {
  const city = req.query.city;

  if (typeof city !== "string" || !city.trim()) {
    res.status(400).json({ error: "city query param is required" });
    return;
  }

  const minPrice = parseOptionalPriceQuery(req.query.minPrice);
  const maxPrice = parseOptionalPriceQuery(req.query.maxPrice);

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    res.status(400).json({ error: "minPrice must be less than or equal to maxPrice" });
    return;
  }

  const hotels = await executeHotelWorkflow(city);
  await persistDedupedHotels(city, hotels);

  if (minPrice !== undefined || maxPrice !== undefined) {
    const filtered = await getHotelsFilteredByPriceInRedis(city, minPrice, maxPrice);
    res.json(filtered);
    return;
  }

  res.json(hotels);
});

export default hotelRoutes;
