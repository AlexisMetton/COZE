<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
