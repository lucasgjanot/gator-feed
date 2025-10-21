import { ne } from "drizzle-orm";
import { readConfig, setUser } from "../config";
import { createUser, getUser, deleteAllUsers, getUsers } from "../lib/db/queries/users";
import { fetchFeed, RSSFeed } from "src/rss";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string,CommandHandler>


export async function handlerAgg(cmdName:string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error("Reset command expects no arguments");
  }
  const feed: RSSFeed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(feed);
}

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

export async function handlerReset(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
        throw new Error("Reset command expects no arguments");
  }
  const result = await deleteAllUsers();
  console.log("Successfully reset users in database")
}


export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0 || args.length > 1) {
      throw new Error("Login command expects one argument");
  }
  const userName = args[0];
  const buscaUser = await getUser(userName);
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


export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (!(cmdName in registry)) {
        throw new Error("Command not found");
    }
    const command = registry[cmdName];
    await command(cmdName, ...args);
}
