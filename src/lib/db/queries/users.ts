import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createUser(name: string) {
  try {
    const result = await db
      .insert(users)
      .values({ name })
      .returning();

    return result[0];
  } catch (err) {
    if ((err as Error).message.includes('Failed query: insert into "users"')) {
      throw new Error(`User "${name}" already exists`);
    }
    throw err;
  }
}

export async function getUser(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
}

export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function deleteAllUsers() {
  const result = await db.delete(users).returning();
  return firstOrUndefined(result);
}
