#!/usr/bin/env node
/**
 * Creates (or resets) the single admin account in MongoDB.
 *
 *   npm run create-admin
 *
 * Reads MONGODB_URI / MONGODB_DB from the environment or .env.local, then asks for the admin email and password.
 * The password is stored as a scrypt hash, in the same format src/lib/admin-account.ts verifies.
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline";
import { promisify } from "node:util";
import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

nextEnv.loadEnvConfig(process.cwd());
const scrypt = promisify(scryptCb);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

const rl = createInterface({ input: stdin, output: stdout, terminal: stdin.isTTY });
let muted = false;
if (stdin.isTTY) {
  // Echo "*" instead of the characters typed while a password is being entered.
  const write = rl._writeToOutput.bind(rl);
  rl._writeToOutput = (text) => write(muted && !/^[\r\n]+$/.test(text) ? "*".repeat(text.length) : text);
}

const lines = rl[Symbol.asyncIterator]();
async function ask(question, { hidden = false } = {}) {
  stdout.write(question);
  muted = hidden;
  const { value = "" } = await lines.next();
  muted = false;
  if (hidden && !stdin.isTTY) stdout.write("\n");
  return value;
}
const askHidden = (question) => ask(question, { hidden: true });

const email = (await ask("Admin email: ")).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("That doesn't look like an email address.");
  process.exit(1);
}

const password = await askHidden("Admin password (min 10 characters): ");
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}
if ((await askHidden("Confirm password: ")) !== password) {
  console.error("Passwords don't match.");
  process.exit(1);
}
rl.close();

const salt = randomBytes(16);
const hash = await scrypt(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15_000 });
try {
  await client.connect();
  const admins = client.db(process.env.MONGODB_DB || "techlogicq").collection("admins");
  const existing = await admins.findOne({ _id: "admin" });
  await admins.updateOne(
    { _id: "admin" },
    { $set: { email, passwordHash, updatedAt: new Date().toISOString() } },
    { upsert: true },
  );
  console.log(existing ? `Admin account updated for ${email}.` : `Admin account created for ${email}.`);
  console.log("Sign in at /admin/login.");
} catch (error) {
  console.error("Could not save the admin account:", error.message);
  console.error("Check MONGODB_URI and that your IP is allowed in MongoDB Atlas > Network Access.");
  process.exitCode = 1;
} finally {
  await client.close();
}
