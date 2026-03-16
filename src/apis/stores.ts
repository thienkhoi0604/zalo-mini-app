import { axiosClient } from "./client";
import type { Store } from "types/store";

export const getStores = async (): Promise<Store[]> => {
  const response = await axiosClient.get<Store[]>("/stores");
  return response.data;
};

