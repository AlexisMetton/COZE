<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\Users;
use App\Repository\UsersRepository;
use App\Repository\DiscussionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class DiscussionController extends AbstractController
{
    #[Route('/discussion/create/{membre}', name: 'create_discussion')]
    public function startDiscussion(int $membre, DiscussionRepository $discussion_repository, UsersRepository $user_repository, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $discussion = new Discussion();
        $discussion->addMembre($user_repository->find($user->getId()));
        $discussion->addMembre($user_repository->find($membre));
        $entityManager->persist($discussion);
        $entityManager->flush();

        return $this->redirectToRoute('app_discussion', ['id' => $discussion->getId()]);
    }

    #[Route('/discussion/{id}', name: 'app_discussion')]
    public function conversation(int $id, DiscussionRepository $discussion_repository): Response
    {
        $discussion = $discussion_repository->find($id);
        if(!$discussion){
            throw $this->createNotFoundException(
                'Aucune dicussion trouvé sous l\'id '.$id
            );
        }
        $user = $this->getUser();
        $titre = $discussion->getNom();
        if(!$titre){
            $titre = '';
            foreach($discussion->getMembres() as $membre){
            if ($membre->getId() != $user->getId()){
                $titre .= $membre->getUsername().' ';
            }
        }
        }
        $membre2;
        foreach($discussion->getMembres() as $membre){
            if ($membre->getId() != $user->getId()){
                $membre2 = $membre;
            }
        }
        return $this->render('discussion/index.html.twig', [
            'titre' => $titre,
            'membres' => $discussion->getMembres(),
            'messages' => $discussion->getMessages(),
        ]);
    }
}
