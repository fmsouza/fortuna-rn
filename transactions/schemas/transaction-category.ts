import { RxCollectionCreator } from 'rxdb';

import transactionCategory from './transaction-category.schema.json';

export const transaction_category: RxCollectionCreator = {
  schema: transactionCategory
};
