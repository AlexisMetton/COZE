<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220811101435 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE discussion (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE discussion_users (discussion_id INT NOT NULL, users_id INT NOT NULL, INDEX IDX_DB1C5EDC1ADED311 (discussion_id), INDEX IDX_DB1C5EDC67B3B43D (users_id), PRIMARY KEY(discussion_id, users_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE discussion_users ADD CONSTRAINT FK_DB1C5EDC1ADED311 FOREIGN KEY (discussion_id) REFERENCES discussion (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE discussion_users ADD CONSTRAINT FK_DB1C5EDC67B3B43D FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE discussion_users DROP FOREIGN KEY FK_DB1C5EDC1ADED311');
        $this->addSql('ALTER TABLE discussion_users DROP FOREIGN KEY FK_DB1C5EDC67B3B43D');
        $this->addSql('DROP TABLE discussion');
        $this->addSql('DROP TABLE discussion_users');
    }
}
