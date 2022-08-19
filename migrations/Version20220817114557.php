<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220817114557 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification CHANGE logo logo VARCHAR(255) DEFAULT \'/img/profil.svg\' NOT NULL');
        $this->addSql('ALTER TABLE users ADD photo VARCHAR(255) DEFAULT \'/img/profil.svg\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification CHANGE logo logo VARCHAR(255) DEFAULT \'/img/profil.svg\'');
        $this->addSql('ALTER TABLE users DROP photo');
    }
}
