import { RxDatabase, addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

import * as accountsSchemas from '~/accounts/schemas';
import * as transactionSchemas from '~/transactions/schemas';

addRxPlugin(RxDBUpdatePlugin);

let db: RxDatabase;

export async function database() {
  if (!db) {
    if (process.env.NODE_ENV !== "production") {
      addRxPlugin(RxDBDevModePlugin);
    }

    await initDatabase();
  }

  return db;
}

async function initDatabase(): Promise<void> {
  db = await createRxDatabase({
    name: 'fortuna',
    storage: getRxStorageDexie()
  });

  await db.addCollections({
    ...accountsSchemas,
    ...transactionSchemas,
  });

  await initialSeed(db);
}

let seeded = false;
async function initialSeed(database: RxDatabase): Promise<void> {
  if(seeded) return;
  const categoriesCount = await database.transaction_category.count().exec();
  if (categoriesCount === 0) {
    await database.transaction_category.bulkInsert([
      {id: 'home',            removable: false, parentId: null, type: 'expense', title: 'Home'},
      {id: 'food',            removable: false, parentId: null, type: 'expense', title: 'Food'},
      {id: 'groceries',       removable: false, parentId: null, type: 'expense', title: 'Groceries'},
      {id: 'shopping',        removable: false, parentId: null, type: 'expense', title: 'Shopping'},
      {id: 'services',        removable: false, parentId: null, type: 'expense', title: 'Services'},
      {id: 'entertainment',   removable: false, parentId: null, type: 'expense', title: 'Entertainment'},
      {id: 'education',       removable: false, parentId: null, type: 'expense', title: 'Education'},
      {id: 'transportation',  removable: false, parentId: null, type: 'expense', title: 'Transportation'},
      {id: 'health',          removable: false, parentId: null, type: 'expense', title: 'Health'},
      {id: 'pet',             removable: false, parentId: null, type: 'expense', title: 'Pet'},
      {id: 'travel',          removable: false, parentId: null, type: 'expense', title: 'Travel'},
      {id: 'taxes',           removable: false, parentId: null, type: 'expense', title: 'Taxes'},
      {id: 'other',           removable: false, parentId: null, type: 'expense', title: 'Other'},
      {id: 'income',          removable: false, parentId: null, type: 'income',  title: 'Income'},
      {id: 'cashback',        removable: false, parentId: null, type: 'income',  title: 'Cashback'},
      {id: 'refunds',         removable: false, parentId: null, type: 'income',  title: 'Refunds'},
    ]);
  }
  seeded = true;
}

export async function clearDatabase(): Promise<void> {
  const db = await database();
  await db.remove();
  
  seeded = false;
  await initDatabase();
}