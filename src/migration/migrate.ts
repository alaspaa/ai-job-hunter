import { Flyway } from 'node-flyway';

const flyway = new Flyway({
  url: 'jdbc:postgresql://localhost:5432/possu',
  user: 'dbuser',
  password: 'dbpass',
  defaultSchema: 'public',
  migrationLocations: ['src/migration/scripts'],
});

export async function migrate(): Promise<boolean> {
  const migrationResult = await flyway.migrate();

  if (!migrationResult.success) {
    throw new Error(
      `Unable to execute migrate command. Error: ${migrationResult.error?.errorCode}`,
    );
  }

  console.log('Flyway migration successful');
  console.log(migrationResult.flywayResponse);
  return migrationResult.success;
}