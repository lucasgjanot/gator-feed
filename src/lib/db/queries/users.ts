import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createUser(name: string) {

    const [result] = await db
      .insert(users)
      .values({ name })
      .onConflictDoNothing({ target: users.name })
      .returning();
    
    if (!result) {
      throw new Error(`User "${name}" already exists`);
    }

    return result;
}                 

export async function getUserByName(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
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

export type User = typeof users.$inferSelect;