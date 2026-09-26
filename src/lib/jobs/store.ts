import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDb, isMongoConfigured } from "../mongo";
import type { Job, JobInput } from "./types";

/**
 * Job openings storage.
 * - With MONGODB_URI set, jobs live in MongoDB (use this on hosts like Vercel, whose file system is read-only).
 * - Otherwise they are kept in data/jobs.json, which suits running on your own machine or a VPS.
 */
type JobStore = {
  list(): Promise<Job[]>;
  get(id: string): Promise<Job | null>;
  create(input: JobInput): Promise<Job>;
  update(id: string, input: JobInput): Promise<Job | null>;
  remove(id: string): Promise<boolean>;
};

const byNewest = (a: Job, b: Job) => b.createdAt.localeCompare(a.createdAt);

// ---------- JSON file store ----------
const FILE = path.join(process.cwd(), "data", "jobs.json");
let queue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Job[]> {
  try {
    const parsed = JSON.parse(await readFile(FILE, "utf8"));
    return Array.isArray(parsed) ? (parsed as Job[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(jobs: Job[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(jobs, null, 2) + "\n", "utf8");
  await rename(tmp, FILE);
}

/** Serialises read-modify-write cycles so concurrent admin edits don't overwrite each other. */
function mutate<T>(fn: (jobs: Job[]) => { jobs: Job[]; result: T }): Promise<T> {
  const run = queue.then(async () => {
    const { jobs, result } = fn(await readAll());
    await writeAll(jobs);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

const fileStore: JobStore = {
  async list() {
    return (await readAll()).sort(byNewest);
  },
  async get(id) {
    return (await readAll()).find((job) => job.id === id) ?? null;
  },
  create(input) {
    const now = new Date().toISOString();
    const job: Job = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
    return mutate((jobs) => ({ jobs: [...jobs, job], result: job }));
  },
  update(id, input) {
    return mutate((jobs) => {
      const index = jobs.findIndex((job) => job.id === id);
      if (index === -1) return { jobs, result: null };
      const updated: Job = { ...jobs[index], ...input, updatedAt: new Date().toISOString() };
      const next = [...jobs];
      next[index] = updated;
      return { jobs: next, result: updated };
    });
  },
  remove(id) {
    return mutate((jobs) => {
      const next = jobs.filter((job) => job.id !== id);
      return { jobs: next, result: next.length !== jobs.length };
    });
  },
};

// ---------- MongoDB store ----------
type JobDoc = Omit<Job, "id"> & { _id: string };

function mongoStore(): JobStore {
  const collection = async () => (await getDb()).collection<JobDoc>("jobs");
  const toJob = ({ _id, ...rest }: JobDoc): Job => ({ id: _id, ...rest });

  return {
    async list() {
      const docs = await (await collection()).find().sort({ createdAt: -1 }).toArray();
      return docs.map(toJob);
    },
    async get(id) {
      const doc = await (await collection()).findOne({ _id: id });
      return doc ? toJob(doc) : null;
    },
    async create(input) {
      const now = new Date().toISOString();
      const doc: JobDoc = { ...input, _id: randomUUID(), createdAt: now, updatedAt: now };
      await (await collection()).insertOne(doc);
      return toJob(doc);
    },
    async update(id, input) {
      const doc = await (await collection()).findOneAndUpdate(
        { _id: id },
        { $set: { ...input, updatedAt: new Date().toISOString() } },
        { returnDocument: "after" },
      );
      return doc ? toJob(doc) : null;
    },
    async remove(id) {
      const res = await (await collection()).deleteOne({ _id: id });
      return res.deletedCount === 1;
    },
  };
}

export const jobStore: JobStore = isMongoConfigured() ? mongoStore() : fileStore;
