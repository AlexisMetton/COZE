<?php

namespace App\Controller;

use App\Entity\Photo;
use App\Entity\Discussion;
use App\Entity\Notification;
use App\Entity\Users;
use App\Form\UsersType;
use App\Repository\UsersRepository;
use App\Repository\DiscussionRepository;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class DiscussionController extends AbstractController
{
    /**
     * @Route("/accueil", name="accueil")
     */
    public function accueil(): Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();

        return $this->render('accueil.html.twig', [
            'user' => $user,
            'discussions' => $user->getDiscussions(),
            'amis' => $user->getAmis(), 
            'notifications' => $user->getNotifications(), 
        ]);
    }

    /**
     * @Route("/profil/{id}", name="profil")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function edit(Request $request, EntityManagerInterface $entityManager, FileUploader $fileUploader)
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $form = $this->createForm(UsersType::class, $user);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            /** @var UploadedFile $profilFile */
            $photoFile = $form->get('photo')->getData();
            if($photoFile){
                $photoFileName = $fileUploader->upload($photoFile);
                $user->setPhoto('/img/' . $photoFileName);
            }

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();
            return $this->redirectToRoute('app_login');
        }

        return $this->render('users/profil.html.twig', [
            'user' => $user,
            'discussions' => $user->getDiscussions(),
            'amis' => $user->getAmis(), 
            'notifications' => $user->getNotifications(), 
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/discussion/clearAll", name="dicussion_clearAll")
     */
    public function ClearAllDiscussion(DiscussionRepository $discussion_repository): Response
    {
        foreach($discussion_repository->findAll() as $discussion){
            foreach($discussion->getMessages() as $message){
                $discussion->removeMessage($message);
            }
    
            foreach($discussion->getMembres() as $membre){
                $discussion->removeMembre($membre);
            }
            $discussion_repository->remove($discussion, true);
        }

        return new Response('Toutes les discussions ont été effacées.');
    }

    /**
     * @Route("/discussion/create/{membre}", name="create_discussion")
     */
    public function startDiscussion(int $membre, DiscussionRepository $discussion_repository, UsersRepository $user_repository, EntityManagerInterface $entityManager): Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $discussion = new Discussion();
        $discussion->addMembre($user_repository->find($user->getId()));
        $discussion->addMembre($user_repository->find($membre));
        $discussion_repository->add($discussion, true);

        return $this->redirectToRoute('app_discussion', ['id' => $discussion->getId()]);
    }

    /**
     * @Route("/discussion/check/{id}", name="check_discussion")
     */
    public function checkDiscussion(int $id, UsersRepository $user_repository, DiscussionRepository $discussion_repository)
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $second_user = $user_repository->find($id);
        $discussions = $discussion_repository->findAll();
        $my_discussion = null;
        foreach($discussions as $discussion){
            if($discussion->hasMembre($user) && $discussion->hasMembre($second_user) && count($discussion->getMembres()) == 2){
                $my_discussion = $discussion;
            }
        }
        if(!$my_discussion){
            return $this->redirectToRoute('create_discussion', ['membre' => $id]);
        }else{
            return $this->redirectToRoute('app_discussion', ['id' => $my_discussion->getId()]);
        }
    }

    /**
     * @Route("/discussion/show", name="show_discussion")
     */
    public function showDiscussion(Request $request):JsonResponse
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $discussions = $user->getDiscussions();
        $start = $request->request->get('start');
        if(!$start){
            return new JsonResponse('Erreur lors de la demande ajax');
        }
        $idx = 0;
        for($i = 0; $i < count($discussions);$i++){
            if(!$discussions[$i] -> hasMessage()){
                $message = '';
                $heure_message = '';
            }else{
                $message = $discussions[$i]->getMessages()[count($discussions[$i]->getMessages()) - 1]->getMessage();
                $heure_message = $discussions[$i]->getMessages()[count($discussions[$i]->getMessages()) - 1]->getDateEnvoi();
            }
            if(!$discussions[$i]->getNom()){
                foreach($discussions[$i]->getMembres() as $membre){
                    if ($membre->getUsername() != $user->getUsername()){
                        $nom = $membre->getUsername();
                    }
                }
            }else{
                $nom = $discussions[$i] -> getNom();
            }
            $jsonData[$idx++] = ['id' => $discussions[$i] -> getId(), 'nom' => $nom, 'photo' => $discussions[$i]->getPhoto(), 'message' => $message, 'date_envoi' => $heure_message];
        }
        return new JsonResponse($jsonData);
    }

    /**
     * @Route("/discussion/{id}", name="app_discussion")
     */
    public function conversation(int $id, DiscussionRepository $discussion_repository): Response
    {
        $discussion = $discussion_repository->find($id);
        if(!$discussion){
            throw $this->createNotFoundException(
                'Aucune dicussion trouvé sous l\'id '.$id
            );
        }
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();

        if(!$discussion->getNom()){
            foreach($discussion->getMembres() as $membre){
                if ($membre->getUsername() != $user->getUsername()){
                    $nom = $membre->getUsername();
                }
            }
        }else{
            $nom = $discussion -> getNom();
        }
        
        return $this->render('discussion/index.html.twig', [
            'user' => $user,
            'titre' => $nom,
            'membres' => $discussion->getMembres(),
            'messages' => $discussion->getMessages(),
        ]);
}    
}
