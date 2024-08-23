import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionMigration1724319784409 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid NOT NULL,
                "asset_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                "status" varchar(50) NOT NULL,
                "created_at" timestamp NULL DEFAULT NOW(),
                "updated_at" timestamp NULL DEFAULT NOW(),
                CONSTRAINT "transactions_pkey" PRIMARY KEY ("id"),
                CONSTRAINT "transactions_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets" ("id") ON DELETE CASCADE,
                CONSTRAINT "transactions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
