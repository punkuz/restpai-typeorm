import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationCreateUsers1741714619795 implements MigrationInterface {
    name = 'MigrationCreateUsers1741714619795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(350) NOT NULL, \`email\` varchar(255) NOT NULL, \`uniqueSlug\` varchar(255) NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`password\` varchar(255) NOT NULL, \`passwordConfirm\` varchar(255) NULL, \`passwordChangedAt\` timestamp NULL, \`passwordResetToken\` varchar(255) NULL, \`passwordResetExpires\` timestamp NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`isPermanentDeleted\` tinyint NOT NULL DEFAULT 0, \`lastLogin\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
