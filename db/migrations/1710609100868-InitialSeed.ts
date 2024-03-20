import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSeed1710609100868 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const transactionCategories = [
      {id: 1,  removable: false, parentId: null, type: 'expense', title: 'Home'},
      {id: 2,  removable: false, parentId: null, type: 'expense', title: 'Food'},
      {id: 3,  removable: false, parentId: null, type: 'expense', title: 'Groceries'},
      {id: 4,  removable: false, parentId: null, type: 'expense', title: 'Shopping'},
      {id: 5,  removable: false, parentId: null, type: 'expense', title: 'Services'},
      {id: 6,  removable: false, parentId: null, type: 'expense', title: 'Entertainment'},
      {id: 7,  removable: false, parentId: null, type: 'expense', title: 'Education'},
      {id: 8,  removable: false, parentId: null, type: 'expense', title: 'Transportation'},
      {id: 9,  removable: false, parentId: null, type: 'expense', title: 'Health'},
      {id: 10, removable: false, parentId: null, type: 'expense', title: 'Pet'},
      {id: 11, removable: false, parentId: null, type: 'expense', title: 'Travel'},
      {id: 12, removable: false, parentId: null, type: 'expense', title: 'Taxes'},
      {id: 13, removable: false, parentId: null, type: 'income',  title: 'Income'},
      {id: 14, removable: false, parentId: null, type: 'income',  title: 'Cashback'},
      {id: 15, removable: false, parentId: null, type: 'income',  title: 'Refunds'},
      {id: 16, removable: false, parentId: null, type: 'expense', title: 'Other'},
      {id: 17, removable: false, parentId: null, type: 'expense', title: 'Unknown'},
    ];

    await queryRunner.query(`
        INSERT INTO transaction_category (id, removable, parentId, type, title)
        VALUES ${transactionCategories.map(category => `(${category.id}, ${category.removable ? 1 : 0}, ${category.parentId || 'NULL'}, '${category.type}', '${category.title}')`).join(', ')}
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "transaction_category" WHERE "id" IN ('1', '2', '3')`);
  }
}
