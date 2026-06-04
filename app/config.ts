const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
};

export const PORT = process.env.PORT || 4000;
export const MONGO_URL = requireEnv("MONGO_URL");
export const SECRET = requireEnv("SECRET");
