import axios from "axios";
import { supplierApiBaseUrl } from "../suppliers/supplierApiBaseUrl.js";

export type SupplierHotel = {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
};

export const fetchSupplierA = async (city: string): Promise<SupplierHotel[]> => {
  const response = await axios.get<SupplierHotel[]>(`${supplierApiBaseUrl}/supplierA/hotels?city=${city}`);

  return response.data;
};

export const fetchSupplierB = async (city: string): Promise<SupplierHotel[]> => {
  const response = await axios.get<SupplierHotel[]>(`${supplierApiBaseUrl}/supplierB/hotels?city=${city}`);

  return response.data;
};
