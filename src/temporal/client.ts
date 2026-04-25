import { Client, Connection } from "@temporalio/client";

export type Hotel = {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
};

let temporalClient: Client | null = null;

const getTemporalClient = async (): Promise<Client> => {
  if (temporalClient) {
    return temporalClient;
  }

  const temporalAddress = process.env.TEMPORAL_ADDRESS ?? "localhost:7233";
  const connection = await Connection.connect({ address: temporalAddress });
  temporalClient = new Client({ connection });

  return temporalClient;
};

export const executeHotelWorkflow = async (city: string): Promise<Hotel[]> => {
  const client = await getTemporalClient();

  const result = await client.workflow.execute("hotelWorkflow", {
    args: [city],
    taskQueue: "hotel-queue",
    workflowId: `hotel-${city}`,
  });

  return result as Hotel[];
};
