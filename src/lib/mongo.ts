import "server-only";
import type { Db, MongoClient } from "mongodb";

/** True when MONGODB_URI is set: admin account and job openings are then stored in MongoDB. */
export function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

// Reuse one client across hot reloads and requests.
const globalForMongo = globalThis as unknown as { __tlqMongo?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");
  globalForMongo.__tlqMongo ??= import("mongodb")
    .then(({ MongoClient }) => new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 }).connect())
    .catch((error) => {
      globalForMongo.__tlqMongo = undefined; // allow a retry on the next request
      throw error;
    });
  const client = await globalForMongo.__tlqMongo;
  return client.db(process.env.MONGODB_DB || "techlogicq");
}
