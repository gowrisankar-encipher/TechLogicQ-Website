import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { safeEqual } from "./auth";
import { getDb, isMongoConfigured } from "./mongo";

/**
 * The single admin account, stored only in MongoDB (`admins` collection): the email and a scrypt hash of the password.
 * Create it with `npm run create-admin` (scripts/create-admin.mjs, which uses the same hash format),
 * and change the password later from /admin/password.
 */
const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const ADMIN_ID = "admin";
const KEY_LENGTH = 64;

type AdminDoc = { _id: string; email: string; passwordHash: string; updatedAt: string };

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function admins() {
  return (await getDb()).collection<AdminDoc>("admins");
}

/** Whether an admin can sign in at all with the current configuration. */
export async function isAdminLoginAvailable() {
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) return false;
  if (!isMongoConfigured()) return false;
  return Boolean(await (await admins()).findOne({ _id: ADMIN_ID }, { projection: { _id: 1 } }));
}

export async function verifyAdminLogin(email: string, password: string) {
  if (!isMongoConfigured()) return false;
  const admin = await (await admins()).findOne({ _id: ADMIN_ID });
  if (!admin) return false;
  const [emailOk, passwordOk] = await Promise.all([
    safeEqual(normalizeEmail(email), admin.email),
    verifyPassword(password, admin.passwordHash),
  ]);
  return emailOk && passwordOk;
}

export async function getAdminEmail() {
  if (!isMongoConfigured()) return "";
  const admin = await (await admins()).findOne({ _id: ADMIN_ID }, { projection: { email: 1 } });
  return admin?.email ?? "";
}

export type ChangePasswordResult = { ok: true } | { ok: false; field: "current" | "next" | "form"; error: string };

export async function changeAdminPassword(current: string, next: string): Promise<ChangePasswordResult> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      field: "form",
      error: "Password changes need MongoDB. Set MONGODB_URI.",
    };
  }
  const collection = await admins();
  const admin = await collection.findOne({ _id: ADMIN_ID });
  if (!admin || !(await verifyPassword(current, admin.passwordHash))) {
    return { ok: false, field: "current", error: "Current password is incorrect." };
  }
  if (next.length < 10) return { ok: false, field: "next", error: "Use at least 10 characters." };
  await collection.updateOne(
    { _id: ADMIN_ID },
    { $set: { passwordHash: await hashPassword(next), updatedAt: new Date().toISOString() } },
  );
  return { ok: true };
}
