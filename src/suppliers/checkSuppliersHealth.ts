import axios from "axios";
import { supplierApiBaseUrl } from "./supplierApiBaseUrl.js";

const HEALTH_PROBE_CITY = "delhi";
const HEALTH_TIMEOUT_MS = 3000;

export type SupplierProbeResult = {
  ok: boolean;
  latencyMs?: number;
  error?: string;
};

async function probeSupplierHotels(path: string): Promise<SupplierProbeResult> {
  const url = `${supplierApiBaseUrl}${path}?city=${encodeURIComponent(HEALTH_PROBE_CITY)}`;
  const start = Date.now();
  try {
    const res = await axios.get<unknown>(url, {
      timeout: HEALTH_TIMEOUT_MS,
      validateStatus: () => true,
    });
    const latencyMs = Date.now() - start;
    if (res.status !== 200) {
      return { ok: false, latencyMs, error: `HTTP ${res.status}` };
    }
    if (!Array.isArray(res.data)) {
      return { ok: false, latencyMs, error: "response is not a JSON array" };
    }
    return { ok: true, latencyMs };
  } catch (e) {
    const latencyMs = Date.now() - start;
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, latencyMs, error: message };
  }
}

export async function checkSuppliersHealth(): Promise<{
  supplierA: SupplierProbeResult;
  supplierB: SupplierProbeResult;
}> {
  const [supplierA, supplierB] = await Promise.all([
    probeSupplierHotels("/supplierA/hotels"),
    probeSupplierHotels("/supplierB/hotels"),
  ]);
  return { supplierA, supplierB };
}
