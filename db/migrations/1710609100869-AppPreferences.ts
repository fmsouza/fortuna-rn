import { MigrationInterface, QueryRunner } from 'typeorm'

export class AppPreferences1710609100869 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "app_preferences" (
        id TEXT PRIMARY KEY,
        value TEXT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);


    const preferences = [
      {id: 'language', value: null },
      {id: 'dark_mode', value: null },
    ];

    await queryRunner.query(`
      INSERT INTO app_preferences (id, value)
      VALUES ${preferences.map(pref => `('${pref.id}', ${pref.value})`).join(', ')}
    `);

  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app_preferences"`);
  }
}
