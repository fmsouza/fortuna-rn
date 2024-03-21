import { MigrationInterface, QueryRunner } from 'typeorm'

export class LocalBackupPreference1710609100870 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "app_preferences" (id, value) VALUES ('last_backup_local', null)`);

  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "app_preferences" WHERE id = 'last_backup_local'`);
  }
}
