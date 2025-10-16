import migrationRunner from 'node-pg-migrate';
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {

  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join(process.cwd(), 'infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  }
  if (request.method === 'GET') {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method == 'POST') {
    const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false,
    });

    await dbClient.end();

    if(migratedMigrations.length > 0){
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).json({ error: 'Method not allowed' });

}

// This API route handles GET requests to check the status of the server.
// If the request method is not GET, it responds with a 405 Method Not Allowed status.
// The response also includes an Allow header indicating that only GET requests are allowed.
