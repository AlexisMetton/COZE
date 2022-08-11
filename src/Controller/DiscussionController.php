<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\Users;
use App\Repository\UsersRepository;
use App\Repository\DiscussionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class DiscussionController extends AbstractController
{
    /*#[Route('/user/create', name: 'create_user')]
    public function createUser(UsersRepository $user_repository, #[CurrentUser] ?Users $user): Response
    {
        $user1 = new Users();
        $user2 = new Users();
        $user3 = new Users();
        $user1->setUsername('Tony');
        $user2->setUsername('Frank');
        $user3->setUsername('Robert');
        $user1->setRoles(['ROLE_USER']);
        $user2->setRoles(['ROLE_USER']);
        $user3->setRoles(['ROLE_USER']);
        $user1->setPassword('1234');
        $user2->setPassword('1234');
        $user3->setPassword('1234');
        $user1->setEmail('tony@tony.fr');
        $user2->setEmail('frank@frank.fr');
        $user3->setEmail('robert@frank.fr');

        $user_repository->add($user1);
        $user_repository->add($user2);
        $user_repository->add($user3);

        return new Response('Utilisateurs créés');
    }*/
    

    #[Route('/discussion/create/{membres}', name: 'create_discussion')]
    public function startDiscussion($membres, DiscussionRepository $discussion_repository): Response
    {
        $user = $this->getUser();
        $discussion = new Discussion();
        $discussion->addMembre($discussion_repository->find($user->getId()));
        foreach($membres as $membre_id){
            $discussion->addMembre($discussion_repository->find($membre_id));
        }
        $discussion_repository->add($discussion);

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
