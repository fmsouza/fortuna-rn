import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSetup1710609100866 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        accountBankType TEXT,
        currency TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transaction_category" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parentId INT,
        title TEXT,
        type TEXT,
        removable BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transaction" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        accountId INT,
        externalId TEXT,
        type TEXT,
        title TEXT,
        amount INT,
        origin TEXT,
        details TEXT,
        categoryId INT,
        registeredAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "transaction_category"`);
    await queryRunner.query(`DROP TABLE "account"`);
  }
}