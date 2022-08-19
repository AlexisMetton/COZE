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
    #[Route('/amis', name: 'app_amis')]
    public function index(): Response
    {
        return $this->render('amis/index.html.twig', [
            'controller_name' => 'AmisController',
        ]);
    }
}
