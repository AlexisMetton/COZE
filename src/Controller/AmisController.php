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
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class AmisController extends AbstractController
{
    /**
     * @Route("/ami/add/{id}", name="ajouter_ami")
     */
    public function ajouterAmi(HubInterface $hub, UsersRepository $user_repository, int $id, EntityManagerInterface $entityManager): Response
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
        $notification->addUserId($ami);
        $entityManager->persist($notification);
        $entityManager->flush();
        $ami->addNotification($notification);
        $entityManager->persist($ami);
        $entityManager->flush();

        $update = new Update('https://notification/demande/'.$notification->getUserId()[0]->getId(),json_encode(["id" => $notification->getId(), 'photo' => $user->getPhoto(), 'message' => $notification->getMessage(), 'type' => $notification->getType()]));
        $hub->publish($update);

        return new Response($ami->getUsername() . " a été ajouté(e) dans les amis.");
    }

    /**
     * @Route("/ami/reponse", name="reponse_notification")
     */
    public function reponseNotification(HubInterface $hub, Request $request, UsersRepository $user_repository, NotificationRepository $notification_repository, EntityManagerInterface $entityManager): JsonResponse
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
                $notification_reponse->addUserId($ami);
                $entityManager->persist($notification_reponse);
                $entityManager->flush();
                $ami->addNotification($notification_reponse);
                $entityManager->persist($ami);
                $entityManager->flush();
                $jsonData=["id"=>$ami->getId(), "username"=>$ami->getUsername(), "photo"=>$ami->getPhoto()];
            }
            $notification_repository->remove($notification, true);

            $update = new Update('https://notification/reponse/'.$notification_reponse->getUserId()[0]->getId(),json_encode(["id" => $notification_reponse->getId(), 'photo' => $user->getPhoto(), 'message' => $notification_reponse->getMessage(), 'type' => $notification_reponse->getType()]));
            $hub->publish($update);

            return new JsonResponse($jsonData);
        }else{
            return new JsonResponse('Erreur envoi donnée ajax.');
        }
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
