# gator-feed

A blog aggregator built in TypeScript as part of the Boot.dev project.

## Prerequisites

Before running the CLI, make sure you have:

- [Node.js](https://nodejs.org/) version 16 or higher
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [TypeScript](https://www.typescriptlang.org/) installed globally or in your project
- A running **PostgreSQL** database instance
- A `.gatorconfig.json` configuration file located in your home directory (`~/.gatorconfig.json`)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/lucasgjanot/gator-feed.git
cd gator-feed
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install TypeScript and necessary type definitions if not already installed:
```bash
npm install --save-dev typescript @types/node
# or
yarn add --dev typescript @types/node
```

## Installing PostgreSQL and Creating the `gator` Database

### Installing PostgreSQL

#### On macOS (using Homebrew)

```bash
brew update
brew install postgresql
brew services start postgresql
```

#### On Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Creating the `gator` Database and User
1. Switch to the postgres user (Linux/macOS):
```bash
sudo -i -u postgres
```
2. Change password for postgres user (your choice):
```bash
passwd postgres
```
3. Open the PostgreSQL interative terminal:
```bash
psql
```
4. Create a new database called `gator`
```sql
CREATE DATABASE gator;
```
5. (Optional) Change password for default user:
```sql
ALTER USER postgres PASSWORD 'password';
```
6. Exit the psql shell
```bash
exit
```

## Configuration

### `.gatorconfig.json`
Create a .gatorconfig.json file in your home directory (~/.gatorconfig.json) with content like this:
```json
{
  "db_url": "postgres://username:password@localhost:5432/gator?sslmode=disable",
  "current_user_name": "your_username"
}
```
- `db_url`: The connection string for your PostgreSQL database. Replace `username`, `password`, `localhost`, and other values with your actual settings.

- `current_user_name`: The username currently logged in or used by default in the CLI. (on initiating project can be any string)

### `drizzle.config.ts`

Also configure the `drizzle.config.ts` file in the project root to set feed sources, output paths, and other aggregator options.

### Configure Gator database
```bash
npm run db
```

## Runing the Aggregator

**ALWAYS PREFIX COMMANDS WITH `npm run start`**  

| Command     | Description                                    | Requires Login? |
| ----------- | ---------------------------------------------- | --------------- |
| `login`     | Log in to your account.                        | No              |
| `register`  | Register a new user.                           | No              |
| `reset`     | Reset your password.                           | No              |
| `users`     | List all users.                                | No              |
| `agg`       | Run the aggregator to fetch and process feeds. | No              |
| `addfeed`   | Add a new feed to your subscription list.      | Yes             |
| `feeds`     | List all available feeds.                      | No              |
| `follow`    | Follow a feed.                                  | Yes             |
| `following` | List feed that current users is following.                  | Yes             |
| `unfollow`  | Unfollow a feed.                               | Yes             |
| `browse`    | Browse post from feeds current user follows.            | Yes             |

### How to Use Commands
#### Exemple: To register a user, run:
```bash
npm run start register <user>
```
You can pass additional arguments as needed by each command.

## Thanks

Special thanks to [Boot.dev](https://boot.dev/) for providing guidance and resources that helped in writing the code for this project.

