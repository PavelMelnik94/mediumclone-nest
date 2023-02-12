import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1675707463400 implements MigrationInterface {
	name = 'SeedDb1675707463400';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
		);

		// password is admin
		await queryRunner.query(
			`INSERT INTO users (username, email, password) VALUES ('john', 'john_rembo@test.com', '$2b$10$KD7LNVAIv3P0gI.u8bYeVO2vdvwq2KfZ4Rw8KVcb.iNAnxvfxqcne')`,
		);

		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'first article description', 'first article body', 'dragons, coffee', 1)`,
		);

		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'Second article', 'second article description', 'second article body', 'dragons, coffee', 1)`,
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public async down(): Promise<void> {}
}
