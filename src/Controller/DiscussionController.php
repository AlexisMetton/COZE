<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Repository\UsersRepository;
use App\Repository\DiscussionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DiscussionController extends AbstractController
{
    /**
     * @Route("/accueil", name="accueil")
     */
    public function accueil(DiscussionRepository $discussion_repository): Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();

        return $this->render('accueil.html.twig', [
            'user' => $user,
            'discussions' => $user->getDiscussions(),
            'amis' => $user->getAmis(), 
            'notifications' => $user->getNotifications(),
        ]);
    }

    /**
     * @Route("/discussion/clearAll", name="dicussion_clearAll")
     */
    public function ClearAllDiscussion(DiscussionRepository $discussion_repository): Response
    {
        foreach($discussion_repository->findAll() as $discussion){
            foreach($discussion->getMessages() as $message){
                $discussion->removeMessage($message);
            }
    
            foreach($discussion->getMembres() as $membre){
                $discussion->removeMembre($membre);
            }
            $discussion_repository->remove($discussion, true);
        }

        return new Response('Toutes les discussions ont été effacées.');
    }

    /**
     * @Route("/discussion/create/{membre}", name="create_discussion")
     */
    public function startDiscussion(int $membre, DiscussionRepository $discussion_repository, UsersRepository $user_repository, EntityManagerInterface $entityManager): Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $discussion = new Discussion();
        $discussion->addMembre($user_repository->find($user->getId()));
        $discussion->addMembre($user_repository->find($membre));
        $discussion->setNom($user_repository->find($membre)->getUsername());
        $entityManager->persist($discussion);
        $entityManager->flush();

        return $this->redirectToRoute('app_discussion', ['id' => $discussion->getId()]);
    }

    /**
     * @Route("/discussion/{id}", name="app_discussion")
     */
    public function conversation(int $id, DiscussionRepository $discussion_repository, UsersRepository $user_repository): Response
    {
        $discussion = $discussion_repository->find($id);
        if(!$discussion){
            throw $this->createNotFoundException(
                'Aucune dicussion trouvé sous l\'id '.$id
            );
        }
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $titre = $discussion->getNom();
        
        return $this->render('discussion/index.html.twig', [
            'titre' => $discussion->getNom(),
            'membres' => $discussion->getMembres(),
            'messages' => $discussion->getMessages(),
            'user_repository' => $user_repository,
        ]);
    }

    /**
     * @Route("/discussion/check/{id}", name="check_discussion")
     */
    public function checkDiscussion(int $id, UsersRepository $user_repository, DiscussionRepository $discussion_repository)
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $second_user = $user_repository->find($id);
        $discussion = $discussion_repository->findOneBy(['nom' => $second_user->getUsername()]);
        if(!$discussion){
            return $this->redirectToRoute('create_discussion', ['membre' => $id]);
        }else{
            return $this->redirectToRoute('app_discussion', ['id' => $discussion->getId()]);
        }
    }
}
