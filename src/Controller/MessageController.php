<?php

namespace App\Controller;


use App\Entity\Notification;
use App\Entity\Discussion;
use App\Entity\Message;
use App\Repository\DiscussionRepository;
use App\Repository\MessageRepository;
use App\Repository\UsersRepository;
use App\EventListener\UserChangedNotifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class MessageController extends AbstractController
{
    /**
     * @Route("/message/envoi", name="send_message")
     */
    public function sendMessage(HubInterface $hub, DiscussionRepository $discussion_repository, Request $request, EntityManagerInterface $entityManager):JsonResponse
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
        
        $update = new Update('https://message/'.$idDiscussion ,json_encode(["id" => $message->getId(), "discussion" => $idDiscussion, 'nom' => $user->getUsername(), 'photo' => $user->getPhoto(), 'message' => $request->request->get('message'), 'heure' => new \DateTime('now', new \DateTimeZone('Europe/Paris'))]));
        $hub->publish($update);

        foreach ($discussion->getMembres() as $membre){
            if($membre != $user){
                        $notification_message = new Notification();
                        $notification_message->setType("url");
                        $notification_message->setMessage($user->getUsername() . ' vous a envoyé un message.');
                        $notification_message->setLogo($user->getPhoto());
                        $notification_message->setUrl('discussion/'.$discussion->getId());
                        $entityManager->persist($notification_message);
                        $entityManager->flush();
                        $membre->addNotification($notification_message);
                        $entityManager->persist($membre);
                        $entityManager->flush();
            }
        }
        
        return new JsonResponse($jsonData);
    }

}
