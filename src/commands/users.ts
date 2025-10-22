import { readConfig, setUser } from "src/config";
import { createUser, deleteAllUsers, getUserByName, getUsers } from "src/lib/db/queries/users";

export async function handlerUsers(cmdName: string, ...args: string[]) {
  const users = await getUsers()
  const config = readConfig()
  if (users.length === 0) {
    throw new Error("There are no users in the database");
  }
  for (const user of users) {
    if ( user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0 || args.length > 1) {
      throw new Error("Login command expects one argument");
  }
  const userName = args[0];
  const buscaUser = await getUserByName(userName);
  if (!buscaUser) {
    throw new Error(`${userName} user not found on database`)
  }

  setUser(userName);
  console.log(`Successfully logged in as "${userName}".`);
    
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }

  setUser(user.name);
  console.log(`User ${user.name} created successfully!`);
}

  export async function handlerReset(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
        throw new Error("Reset command expects no arguments");
  }
  const result = await deleteAllUsers();
  console.log("Successfully reset users in database")
}