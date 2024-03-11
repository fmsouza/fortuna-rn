import { RxCollectionCreator } from 'rxdb';

import transactionSchema from './transaction.schema.json';

export const transaction: RxCollectionCreator = {
  schema: transactionSchema
};
