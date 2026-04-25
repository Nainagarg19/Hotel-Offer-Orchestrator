import { redis } from "./client.js";
import type { Hotel } from "../temporal/client.js";

const dedupeRedisKey = (city: string) => `hotels:dedupe:${city.trim().toLowerCase()}`;

/** Persist the full deduplicated list produced by the Temporal workflow. */
export async function persistDedupedHotels(city: string, hotels: Hotel[]): Promise<void> {
  await redis.set(dedupeRedisKey(city), JSON.stringify(hotels));
}
/**
 * Filter hotels by optional bounds using the JSON blob written by persistDedupedHotels.
 * Reads from Redis; bounds are applied after parse (Redis holds the source list).
 */
export async function getHotelsFilteredByPriceInRedis(
  city: string,
  minPrice?: number,
  maxPrice?: number,
): Promise<Hotel[]> {
  const key = dedupeRedisKey(city);
  const raw = await redis.get(key);
  if (raw == null) return [];

  let hotels: unknown;
  try {
    hotels = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(hotels)) return [];

  return hotels.filter((h): h is Hotel => {
    if (h === null || typeof h !== "object") return false;
    const p = Number((h as { price?: unknown }).price);
    if (!Number.isFinite(p)) return false;
    if (minPrice !== undefined && p < minPrice) return false;
    if (maxPrice !== undefined && p > maxPrice) return false;
    return true;
  });
}