import { setUser } from "../config";
import { createUser } from "../lib/db/queries/users";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string,CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0 || args.length > 1) {
        throw new Error("Login command expects one argument");
    }
    const userName = args[0];

    setUser(userName);
    console.log(`${userName} has been set on configfile`);
    
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
  console.log("User created successfully!");
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
