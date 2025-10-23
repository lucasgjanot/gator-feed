import { deleteAllUsers } from "src/lib/db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
        throw new Error("Reset command expects no arguments");
  }
  await deleteAllUsers();
  console.log("Successfully reset users and feeds in database");
}