<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Repository\UsersRepository;
use App\Repository\NotificationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class AmisController extends AbstractController
{
    /**
     * @Route("/ami/add/{id}", name="ajouter_ami")
     */
    public function ajouterAmi(UsersRepository $user_repository, int $id, EntityManagerInterface $entityManager): Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $ami = $user_repository->find($id);
        $user->addAmi($ami);
        $entityManager->persist($user);
        $entityManager->flush();
        $notification = new Notification();
        $notification->setType("confirmation");
        $notification->setMessage($user->getUsername() . ' vous a ajouté(e) en ami. Souhaitez-vous accepter l\'invitation ?');
        $notification->setLogo($user->getPhoto());
        $entityManager->persist($notification);
        $entityManager->flush();
        $ami->addNotification($notification);
        $entityManager->persist($ami);
        $entityManager->flush();
        return new Response($ami->getUsername() . " a été ajouté(e) dans les amis.");
    }

    /**
     * @Route("/ami/reponse", name="reponse_notification")
     */
    public function reponseNotification(Request $request, UsersRepository $user_repository, NotificationRepository $notification_repository, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $idNotification = $request->request->get('notification');
        if ($idNotification) {
            $reponse = $request->request->get('reponse');
            $notification = $notification_repository->find($idNotification);
            $jsonData = '';
            if($reponse == 'oui'){
                $amiUsername = explode(' ', $notification->getMessage())[0];
                $ami = $user_repository->findOneBy(['username' => $amiUsername]);
                $user->addAmi($ami);
                $entityManager->persist($user);
                $entityManager->flush();

                $notification_reponse = new Notification();
                $notification_reponse->setType("info_accepter");
                $notification_reponse->setMessage($user->getUsername() . ' a accepté(e) votre demande d\'ami. Il/elle vous a ajouté(e) en ami');
                $notification_reponse->setLogo($user->getPhoto());
                $entityManager->persist($notification_reponse);
                $entityManager->flush();
                $ami->addNotification($notification_reponse);
                $entityManager->persist($ami);
                $entityManager->flush();
                $jsonData=["id"=>$ami->getId(), "username"=>$ami->getUsername()];
            }
            $notification_repository->remove($notification, true);
            return new JsonResponse($jsonData);
        }else{
            return new JsonResponse('Erreur envoi donnée ajax.');
        }
    }


    /**
     * @Route("/discussion/qfewver/{id}", name="ajouter_ami")
     */
    public function notif_message(UsersRepository $user_repository, int $id, EntityManagerInterface $entityManager):Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $ami = $user_repository->find($id);
        $user->addAmi($ami);
        $entityManager->persist($user);
        $entityManager->flush();
        $notification_message = new Notification();
        $notification_message->setType("url");
        $notification_message->setMessage($user->getUsername() . ' vous a envoyé un message.');
        $notification_message->setLogo($user->getPhoto());
        $entityManager->persist($notification_message);
        $entityManager->flush();
        $ami->addNotification($notification_message);
        $entityManager->persist($ami);
        $entityManager->flush();
        return new Response($ami->getUsername() . " vous a envoyé un message");
    }

    /**
     * @Route("/notification/supprimée", name="notification_supprimée")
     */
    public function notification_Suppression(Request $request, NotificationRepository $notification_repository):JsonResponse
    {
        $id = $request->request->get('id');
        if($id){
            $supp_Notif = $notification_repository->find($id);
            $notification_repository->remove($supp_Notif, true);
            return new JsonResponse('Notification supprimée');
        }
    }
}
