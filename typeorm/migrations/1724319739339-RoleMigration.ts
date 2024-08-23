import { MigrationInterface, QueryRunner } from "typeorm";

export class RoleMigration1724319739339 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL,
                "name" varchar(255) NOT NULL,
                "order" integer NOT NULL,
                "created_at" timestamp NULL DEFAULT NOW(),
                "updated_at" timestamp NULL DEFAULT NOW(),
                CONSTRAINT "roles_pkey" PRIMARY KEY ("id"),
                CONSTRAINT "roles_order_unique" UNIQUE ("order")
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('roles')
    }

}
