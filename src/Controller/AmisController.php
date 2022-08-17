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
            if ($reponse == 'oui') {
                $amiUsername = explode(' ', $notification->getMessage())[0];
                $ami = $user_repository->findOneBy(['username' => $amiUsername]);
                $user->addAmi($ami);
                $entityManager->persist($user);
                $entityManager->flush();

                $notification = new Notification();
                $notification->setType("info_accepter");
                $notification->setMessage($user->getUsername() . ' a accepté(e) votre demande d\'ami. Il/elle vous a ajouté(e) en ami');
                $entityManager->persist($notification);
                $entityManager->flush();
                $ami->addNotification($notification);
                $entityManager->persist($ami);
                $entityManager->flush();
                return new Response($ami->getUsername() . " a été ajouté(e) dans les amis.");
            }
            $notification_repository->remove($notification, true);
            return new JsonResponse('Notification supprimée.');
        } else {
            return new JsonResponse('Erreur envoi donnée ajax.');
        }
    }
}
