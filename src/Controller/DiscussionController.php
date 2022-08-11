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
    #[Route('/discussion/{id}', name: 'app_discussion')]
    public function conversation(int $id): Response
    {
        $user = $this->getUser();
        $membre2;
        foreach($discussion->getMembre() as $membre){
            if ($membre->getId() != $user->getId()){
                $membre2 = $membre;
            }
        }
        $discussion_repository = new DiscussionRepository();
        $discussion = $discussion_repository.find($id, );
        return $this->render('discussion/index.html.twig', [
            'titre' => $discussion->getNom() | $membre2->getUsername(),
            'membres' => $discussion->getMembre(),
            'messages' => $discussion->getMessage(),
        ]);
    }
}
