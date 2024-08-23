import { MigrationInterface, QueryRunner } from "typeorm";

export class AssetMigration1724319772197 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "assets" (
                "id" uuid NOT NULL,
                "name" varchar(255) NOT NULL,
                "created_at" timestamp NULL DEFAULT NOW(),
                "updated_at" timestamp NULL DEFAULT NOW(),
                CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('assets')
    }

}
