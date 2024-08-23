import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserMigration1724319761014 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TYPE valid_roles AS ENUM ('animal_lover', 'driver', 'operator', 'supervisor', 'manager');

            CREATE TABLE "users" (
                "id" uuid NOT NULL,
                "name" varchar(255) NOT NULL,
                "username" varchar(255) NOT NULL,
                "email" varchar(255) NOT NULL,
                "password" varchar(255) NOT NULL,
                "role_id" uuid NULL,
                "created_at" timestamp NULL DEFAULT NOW(),
                "updated_at" timestamp NULL DEFAULT NOW(),
                CONSTRAINT "user_pkey" PRIMARY KEY ("id"),
                CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE SET NULL
            );

            CREATE INDEX users_email_idx ON "users" ("email");
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users')
	}
}
