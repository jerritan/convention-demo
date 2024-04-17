/**
 * Retrieve a value from a nested object based on a dot-separated key path.
 * It returns a default response if the key path does not exist or
 * if the key is not provided
 */
export function getValFromNestedObj(
  searchObj: Record<string, any> = {},
  key: string,
  defaultResponse: any = null
): any {
  if (!key) {
    return defaultResponse;
  }

  const keys = key.split(".");
  let newObj = searchObj;
  for (let i = 0; i < keys.length; i++) {
    if (!(keys[i] in newObj)) {
      return defaultResponse;
    }
    newObj = newObj[keys[i]];
    if (newObj === null || newObj === undefined) {
      return defaultResponse;
    }
  }

  return newObj;
}

