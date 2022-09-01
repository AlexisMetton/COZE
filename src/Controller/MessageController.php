<?php

namespace App\Controller;


use App\Entity\Notification;
use App\Entity\Discussion;
use App\Entity\Message;
use App\Service\ReceptionFichier;
use App\Service\ReceptionAudio;
use App\Service\ReceptionVideo;
use App\Service\FileUploader;
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
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MessageController extends AbstractController
{
    /**
     * @Route("/message/envoi", name="send_message")
     */
    public function sendMessage(HubInterface $hub, DiscussionRepository $discussion_repository, Request $request, EntityManagerInterface $entityManager, ReceptionFichier $receptionFichier, ReceptionAudio $receptionAudio, ReceptionVideo $receptionVideo, FileUploader $fileUploader):JsonResponse
    {
        /** @var \App\Entity\Users $user */
        
        $user = $this->getUser();
        $idDiscussion = $request->request->get('id');
        $fichier = $request->files->get('fichier');
        if(!$idDiscussion){
            return new JsonResponse('Erreur à la demande Ajax');
        }
        $id=0;
        foreach($fichier as $file){
            $jsonData[$id++] = $file->getClientMimeType();
        }
        return new JsonResponse($jsonData);
        $discussion = $discussion_repository->find($idDiscussion);
        $message = new Message();
        $message->setUserId($user);
        $message->setDiscussionId($discussion);
        $message->setMessage($request->request->get('message'));
        $message->setDateEnvoi(new \DateTime('now', new \DateTimeZone('Europe/Paris')));
        $nom_fichier = '';
        $type_fichier = '';
        if($fichier){
            if(preg_match('/video/', $fichier-> getClientMimeType())){
                $nom_fichier = '/video/' . $receptionVideo -> upload($fichier);
                $type_fichier = $fichier->getClientMimeType();
            }else if(preg_match('/audio/', $fichier-> getClientMimeType())){
                $nom_fichier = '/audio/' . $receptionAudio -> upload($fichier);
                $type_fichier = $fichier->getClientMimeType();
            }else if (preg_match('/image/', $fichier-> getClientMimeType())){
                $nom_fichier = '/img/' . $fileUploader -> upload($fichier);
                $type_fichier = $fichier->getClientMimeType();
            }else{
                $nom_fichier = '/fichier/' . $receptionFichier->upload($fichier);
                $type_fichier = $fichier->getClientMimeType();
            }
            $message->setFichier($nom_fichier);
            $message->setTypeFichier($type_fichier);
        }
        $entityManager->persist($message);
        $entityManager->flush();
        $discussion->addMessage($message);    
        $entityManager->persist($discussion);
        $entityManager->flush();
        $jsonData = ['nom' => $user->getUsername(), 'photo' => $user->getPhoto()];
        
        $update = new Update('https://message/'.$idDiscussion ,json_encode(["id" => $message->getId(), "discussion" => $idDiscussion, 'nom' => $user->getUsername(), 'photo' => $user->getPhoto(), 'message' => $request->request->get('message'), 'heure' => new \DateTime('now', new \DateTimeZone('Europe/Paris')), 'fichier' => $nom_fichier, 'type_fichier' => $type_fichier]));
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

                $update = new Update('https://notification/'.$membre->getId().'/message/'.$idDiscussion ,json_encode(["id" => $notification_message->getId()]));
                $hub->publish($update);
                $update = new Update('https://notification/'.$membre->getId(),json_encode(["id" => $notification_message->getId(), "discussion" => $idDiscussion, 'photo' => $user->getPhoto(), 'message' => $notification_message->getMessage(), 'type' => $notification_message->getType()]));
                $hub->publish($update);
            }
        }
        
        return new JsonResponse($jsonData);
    }

}
