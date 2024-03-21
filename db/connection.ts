import { DataSource } from 'typeorm';

import { Account } from '~/modules/accounts/types';
import { Transaction, TransactionCategory } from '~/modules/transactions/types';
import { AppPreference } from '~/modules/settings/types';

import * as migrations from './migrations';

const ENTITIES = [Account, AppPreference, Transaction, TransactionCategory];

const MIGRATIONS = Object.values(migrations);

export const DB_NAME = 'fortuna.db';

export const dataSource = new DataSource({
  database: DB_NAME,
  type: 'expo',
  driver: require('expo-sqlite'),
  entities: ENTITIES,
  logging: ['error', 'schema'],
  synchronize: false,
  migrationsRun: true,
  migrations: MIGRATIONS,
});

export async function dbWaitForReady(): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.synchronize();
  }
}


export async function clearDatabase(): Promise<void> {
  await dbWaitForReady();
  await dataSource.dropDatabase();
  await dataSource.destroy();
}