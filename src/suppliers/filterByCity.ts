export type SupplierHotelRecord = {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
};

export function filterHotelsByCity<T extends SupplierHotelRecord>(hotels: T[], city: string): T[] {
  const normalized = city.trim().toLowerCase();
  return hotels.filter((h) => h.city.toLowerCase() === normalized);
}
