const camelToSnake = (camel: string) => {
  return camel.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
};

export const convertKeysToSnakeCase = (obj: Object) => {
  const snakeCaseObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    snakeCaseObj[snakeKey] = value;
  }
  return snakeCaseObj;
};
