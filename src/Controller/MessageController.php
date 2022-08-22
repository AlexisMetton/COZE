<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\Message;
use App\Repository\DiscussionRepository;
use App\Repository\MessageRepository;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class MessageController extends AbstractController
{
    /**
     * @Route("/message/start/{$membre}", name="start_message")
     */
    public function StartDiscussion(int $membre, DiscussionRepository $discussion_repository, UsersRepository $user_repository, MessageRepository $message_repository, Request $request, EntityManagerInterface $entityManager)
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $discussion = new Discussion();
        $discussion->addMembre($user_repository->find($user->getId()));
        $discussion->addMembre($user_repository->find($membre));
        $entityManager->persist($discussion);
        $entityManager->flush();
        $message = new Message();
        $message->setUserId($user);
        $message->setDiscussionId($discussion);
        $message->setMessage($request->request->get('message'));
        $entityManager->persist($message);
        $entityManager->flush();
        $discussion->addMessage($message);    
        $entityManager->persist($discussion);
        $entityManager->flush();
        
        return $this->redirectToRoute('app_discussion', ['id' => $discussion->getId()]);
    }

    /**
     * @Route("/message/envoi", name="send_message")
     */
    public function sendMessage(DiscussionRepository $discussion_repository, UsersRepository $user_repository, MessageRepository $message_repository, Request $request, EntityManagerInterface $entityManager):JsonResponse
    {
        /** @var \App\Entity\Users $user */
        
        $user = $this->getUser();
        $idDiscussion = $request->request->get('id');
        if(!$idDiscussion){
            return new JsonResponse('Erreur à la demande Ajax');
        }
        $discussion = $discussion_repository->find($idDiscussion);
        $message = new Message();
        $message->setUserId($user);
        $message->setDiscussionId($discussion);
        $message->setMessage($request->request->get('message'));
        $message->setDateEnvoi(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
        $entityManager->persist($message);
        $entityManager->flush();
        $discussion->addMessage($message);    
        $entityManager->persist($discussion);
        $entityManager->flush();
        $jsonData = ['nom' => $user->getUsername(), 'photo' => $user->getPhoto()];
        
        return new JsonResponse($jsonData);
    }
}
