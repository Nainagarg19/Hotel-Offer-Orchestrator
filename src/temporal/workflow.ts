import { proxyActivities } from "@temporalio/workflow";

type Hotel = {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
};

type HotelActivities = {
  fetchSupplierA(city: string): Promise<Hotel[]>;
  fetchSupplierB(city: string): Promise<Hotel[]>;
};

const activities = proxyActivities<HotelActivities>({
  startToCloseTimeout: "5s",
});

export async function hotelWorkflow(city: string): Promise<Hotel[]> {
  const [a, b] = await Promise.all([
    activities.fetchSupplierA(city),
    activities.fetchSupplierB(city),
  ]);

  const map = new Map<string, Hotel>();

  [...a, ...b].forEach((hotel) => {
    if (!map.has(hotel.name) || hotel.price < (map.get(hotel.name)?.price ?? Infinity)) {
      map.set(hotel.name, hotel);
    }
  });

  return Array.from(map.values());
}
