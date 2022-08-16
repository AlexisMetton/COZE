<?php

namespace App\Controller;

use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AmisController extends AbstractController
{
    /**
     * @Route("/ami/add/{id}", name="ajouter_ami")
     */
    public function ajouterAmi(UsersRepository $user_repository, int $id, EntityManagerInterface $entityManager):Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $ami = $user_repository->find($id);
        $user->addAmi($ami);
        $entityManager->persist($user);
        $entityManager->flush();

        return new Response($ami->getUsername()." a été ajouté(e) dans les amis.");
    }
}
