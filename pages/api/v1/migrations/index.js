import migrationRunner from 'node-pg-migrate';
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const allowedMethods = ['GET', 'POST'];
  if (!allowedMethods.includes(request.method)) {
    response.setHeader('Allow', allowedMethods.join(', '));
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;

  try {
  dbClient = await database.getNewClient();

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
    return response.status(200).json(pendingMigrations);
  }

  if (request.method == 'POST') {
    const migratedMigrations = await migrationRunner({
    ...defaultMigrationOptions,
    dryRun: false,
    });


    if(migratedMigrations.length > 0){
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

// This API route handles GET requests to check the status of the server.
// If the request method is not GET, it responds with a 405 Method Not Allowed status.
// The response also includes an Allow header indicating that only GET requests are allowed.
