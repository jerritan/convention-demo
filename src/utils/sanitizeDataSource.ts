import { DataSourceItem } from "../interfaces/datasource";

export const sanitizeDataSource =
  (keysToRemove: string[] = ["col_"]) =>
  (arr: DataSourceItem[]) => {
    arr.forEach((item) => {
      Object.keys(item).forEach((key) => {
        keysToRemove.forEach((matchKey) => {
          if (key.includes(matchKey)) {
            delete item[key];
          }
        });
      });
    });
    return arr;
  };
