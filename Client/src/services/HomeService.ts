import axios from "axios";
import type { Advertisement } from "../types/Advertisment";
import type { Product } from "../types/Product";

export interface HomePageData {
  advertisements: Advertisement[];
  hotProducts: Product[];
  laptopProducts: Product[];
  smartphoneProducts: Product[];
  tabletProducts: Product[];
  accessoriesProducts: Product[];
}

export const getHomeData = async (): Promise<HomePageData> => {
  console.time("getHomeData");
  const res = await axios.get<HomePageData>("/api/home");
  console.timeEnd("getHomeData");
  return res.data;
};