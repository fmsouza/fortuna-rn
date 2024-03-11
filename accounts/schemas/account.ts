import { RxCollectionCreator } from 'rxdb';

import accountSchema from './account.schema.json';

export const account: RxCollectionCreator = {
  schema: accountSchema,
};
