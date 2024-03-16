import { DataSource } from 'typeorm';

import { Account } from '~/modules/accounts/types';
import { Transaction, TransactionCategory } from '~/modules/transactions/types';

const ENTITIES = [Account, Transaction, TransactionCategory];

export const dataSource = new DataSource({
  database: 'fortuna.db',
  type: 'expo',
  driver: require('expo-sqlite'),
  entities: ENTITIES,
  logging: ['error', 'schema'],
  synchronize: false,
  migrationsRun: true,
});

export async function dbWaitForReady(): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
}


export async function clearDatabase(): Promise<void> {
  await dbWaitForReady();
  await dataSource.dropDatabase();
}