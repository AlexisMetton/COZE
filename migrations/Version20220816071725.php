<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220816071725 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE users_users DROP FOREIGN KEY FK_F3F401A0506DF1E3');
        $this->addSql('ALTER TABLE users_users DROP FOREIGN KEY FK_F3F401A04988A16C');
        $this->addSql('DROP TABLE users_users');
        $this->addSql('ALTER TABLE message DROP date_envoi');
        $this->addSql('ALTER TABLE users ADD reset_token VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE users_users (users_source INT NOT NULL, users_target INT NOT NULL, INDEX IDX_F3F401A0506DF1E3 (users_source), INDEX IDX_F3F401A04988A16C (users_target), PRIMARY KEY(users_source, users_target)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE users_users ADD CONSTRAINT FK_F3F401A0506DF1E3 FOREIGN KEY (users_source) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE users_users ADD CONSTRAINT FK_F3F401A04988A16C FOREIGN KEY (users_target) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD date_envoi DATETIME NOT NULL');
        $this->addSql('ALTER TABLE users DROP reset_token');
    }
}
