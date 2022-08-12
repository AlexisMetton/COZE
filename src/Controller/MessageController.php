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

class MessageController extends AbstractController
{
    #[Route('/message/start/{$membre}', name: 'start_message')]
    public function StartDiscussion(int $membre, DiscussionRepository $discussion_repository, UsersRepository $user_repository, MessageRepository $message_repository, Request $request, EntityManagerInterface $entityManager): Response
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

    #[Route('/message/envoi/{id}', name: 'send_message')]
    public function sendMessage(int $id, DiscussionRepository $discussion_repository, UsersRepository $user_repository, MessageRepository $message_repository, Request $request, EntityManagerInterface $entityManager)
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $discussion = $discussion_repository->find($id);
        $message = new Message();
        $message->setUserId($user);
        $message->setDiscussionId($discussion);
        $message->setMessage($request->request->get('message'));
        $entityManager->persist($message);
        $entityManager->flush();
        $discussion->addMessage($message);    
        $entityManager->persist($discussion);
        $entityManager->flush();
        
        return json_encode('Message envoyé avec succès');
    }
}
