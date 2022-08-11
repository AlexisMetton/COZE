<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\Users;
use App\Repository\DiscussionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DiscussionController extends AbstractController
{
    #[Route('/discussion/create', name: 'create_discussion')]
    public function createDiscussion(DiscussionRepository $discussion_repository): Response
    {
        $discussion_repository->add(new Discussion());
        return $this->render('discussion/index.html.twig', [
            'titre' => $discussion->getNom() | $membre2->getUsername(),
            'membres' => $discussion->getMembre(),
            'messages' => $discussion->getMessage(),
        ]);
    }

    #[Route('/discussion/{id}', name: 'app_discussion')]
    public function conversation(int $id, DiscussionRepository $discussion_repository): Response
    {
        $discussion = $discussion_repository->find($id);
        $user = $this->getUser();
        $membre2;
        foreach($discussion->getMembre() as $membre){
            if ($membre->getId() != $user->getId()){
                $membre2 = $membre;
            }
        }
        return $this->render('discussion/index.html.twig', [
            'titre' => $discussion->getNom() | $membre2->getUsername(),
            'membres' => $discussion->getMembre(),
            'messages' => $discussion->getMessage(),
        ]);
    }
}
