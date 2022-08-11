<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\Message;
use App\Repository\DiscussionRepository;
use App\Repository\MessageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class MessageController extends AbstractController
{
    #[Route('/message/start/{$membres}', name: 'start_message')]
    public function StartDiscussion($membres, DiscussionRepository $discussion_repository,MessageRepository $message_repository, Request $request): Response
    {
        $user = $this->getUser();
        $discussion = new Discussion();
        $discussion->addMembre($discussion_repository->find($user->getId()));
        foreach($membres as $membre_id){
            $discussion->addMembre($discussion_repository->find($membre_id));
        }
        $message = new Message();
        $message->setUserId($user);
        $message->setDiscussionId($discussion);
        $message->setMessage($request->request->get('message'));
        $discussion->addMessage($message);
        $discussion_repository->add($discussion);
        $message_repository->add($message);

        
        return $this->redirectToRoute('app_discussion', ['id' => $discussion->getId()]);
    }
}
