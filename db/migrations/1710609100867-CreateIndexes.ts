import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateIndexes1710609100867 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_AccountRegisteredAt" ON "transaction" (accountId, registeredAt);
      CREATE INDEX "IDX_AccountId" ON "transaction" (accountId);
      CREATE INDEX "IDX_CategoryId" ON "transaction" (categoryId);
      CREATE INDEX "IDX_CategoryParentId" ON "transaction_category" (parentId);
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_AccountRegisteredAt";
      DROP INDEX "IDX_AccountId";
      DROP INDEX "IDX_CategoryId";
    `);
  }
}
