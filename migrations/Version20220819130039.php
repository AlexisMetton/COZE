<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220819130039 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(255) NOT NULL, logo VARCHAR(255) DEFAULT \'/img/profil.svg\' NOT NULL, message VARCHAR(255) NOT NULL, url VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification_users (notification_id INT NOT NULL, users_id INT NOT NULL, INDEX IDX_D2374010EF1A9D84 (notification_id), INDEX IDX_D237401067B3B43D (users_id), PRIMARY KEY(notification_id, users_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE notification_users ADD CONSTRAINT FK_D2374010EF1A9D84 FOREIGN KEY (notification_id) REFERENCES notification (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notification_users ADD CONSTRAINT FK_D237401067B3B43D FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE discussion ADD photo VARCHAR(255) DEFAULT \'/img/profil.svg\' NOT NULL');
        $this->addSql('ALTER TABLE users ADD reset_token VARCHAR(50) DEFAULT NULL, ADD photo VARCHAR(255) DEFAULT \'/img/profil.svg\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_users DROP FOREIGN KEY FK_D2374010EF1A9D84');
        $this->addSql('ALTER TABLE notification_users DROP FOREIGN KEY FK_D237401067B3B43D');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE notification_users');
        $this->addSql('ALTER TABLE discussion DROP photo');
        $this->addSql('ALTER TABLE users DROP reset_token, DROP photo');
    }
}
