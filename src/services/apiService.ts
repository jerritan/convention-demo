/* eslint-disable @typescript-eslint/no-explicit-any */
import { HQ_URL, dataSourceString } from "../config";

export const fetchData = async (csv_name: string): Promise<any> => {
  const url = `${HQ_URL}${dataSourceString(csv_name)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
