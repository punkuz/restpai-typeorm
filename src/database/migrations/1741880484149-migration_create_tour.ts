import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationCreateTour1741880484149 implements MigrationInterface {
    name = 'MigrationCreateTour1741880484149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_a24972ebd73b106250713dcddd9\``);
        await queryRunner.query(`CREATE TABLE \`tour\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(40) NOT NULL, \`image\` varchar(255) NULL, \`rating\` float NOT NULL, \`price\` float NOT NULL, \`duration\` int NULL, \`maxGroupSize\` int NULL, \`difficulty\` enum ('easy', 'medium', 'difficult') NOT NULL, \`ratingsAverage\` float NULL, \`ratingsQuantity\` int NULL, \`summary\` text NULL, \`description\` text NULL, \`imageCover\` varchar(255) NOT NULL, \`images\` text NULL, \`startDates\` text NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_948c1044932dba70d131655953\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_booked_tours_tour\` (\`userId\` int NOT NULL, \`tourId\` int NOT NULL, INDEX \`IDX_7c50e83d82c1783de59f53071b\` (\`userId\`), INDEX \`IDX_86a87711bd51d6f1706ea6e8d5\` (\`tourId\`), PRIMARY KEY (\`userId\`, \`tourId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`profile\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`uniqueSlug\` \`uniqueSlug\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('user', 'admin', 'guide') NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordConfirm\` \`passwordConfirm\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordChangedAt\` \`passwordChangedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordResetToken\` \`passwordResetToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordResetExpires\` \`passwordResetExpires\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLogin\` \`lastLogin\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_a24972ebd73b106250713dcddd9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tour\` ADD CONSTRAINT \`FK_d305ffb20137507c3ac63e128e4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_booked_tours_tour\` ADD CONSTRAINT \`FK_7c50e83d82c1783de59f53071ba\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_booked_tours_tour\` ADD CONSTRAINT \`FK_86a87711bd51d6f1706ea6e8d5d\` FOREIGN KEY (\`tourId\`) REFERENCES \`tour\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_booked_tours_tour\` DROP FOREIGN KEY \`FK_86a87711bd51d6f1706ea6e8d5d\``);
        await queryRunner.query(`ALTER TABLE \`user_booked_tours_tour\` DROP FOREIGN KEY \`FK_7c50e83d82c1783de59f53071ba\``);
        await queryRunner.query(`ALTER TABLE \`tour\` DROP FOREIGN KEY \`FK_d305ffb20137507c3ac63e128e4\``);
        await queryRunner.query(`ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_a24972ebd73b106250713dcddd9\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastLogin\` \`lastLogin\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordResetExpires\` \`passwordResetExpires\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordResetToken\` \`passwordResetToken\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordChangedAt\` \`passwordChangedAt\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`passwordConfirm\` \`passwordConfirm\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('user', 'admin') NOT NULL DEFAULT ''user''`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`uniqueSlug\` \`uniqueSlug\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`profile\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_86a87711bd51d6f1706ea6e8d5\` ON \`user_booked_tours_tour\``);
        await queryRunner.query(`DROP INDEX \`IDX_7c50e83d82c1783de59f53071b\` ON \`user_booked_tours_tour\``);
        await queryRunner.query(`DROP TABLE \`user_booked_tours_tour\``);
        await queryRunner.query(`DROP INDEX \`IDX_948c1044932dba70d131655953\` ON \`tour\``);
        await queryRunner.query(`DROP TABLE \`tour\``);
        await queryRunner.query(`ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_a24972ebd73b106250713dcddd9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
