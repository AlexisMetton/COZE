<?php

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\Users;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DiscussionController extends AbstractController
{
    #[Route('/discussion/{id}', name: 'app_discussion')]
    public function conversation(int $id): Response
    {
        
        return $this->render('discussion/index.html.twig', [
            'controller_name' => 'DiscussionController',
        ]);
    }
}
