<?php

namespace App\Controller;

Use App\Entity\Discussion;
use App\Form\UsersType;
use App\Repository\UsersRepository;
use App\Repository\DiscussionRepository;
use App\Repository\NotificationRepository;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints\Url;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class DiscussionController extends AbstractController
{
    /**
     * @Route("/accueil", name="accueil")
     */
    public function accueil(): Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();

        $discussions = $user->getDiscussions();
        $liste_discussion = [];
        if(count($discussions) > 1){
            for($i=0; $i<count($discussions); $i++){
                $tmp = $i;
                for($j=$i+1; $j<count($discussions); $j++){
                    if($discussions[$tmp] ->getLastMessage() != null && $discussions[$j] ->getLastMessage() != null){
                        if($discussions[$tmp]->getLastMessage()->getDateEnvoi() < $discussions[$j]->getLastMessage()->getDateEnvoi()){
                            $tmp = $j;
                        }
                    }
                }
                $liste_discussion[] = $discussions[$tmp];
                $discussions[$tmp] = $discussions[$i];
            }
        }else if(count($discussions) == 1){
            $liste_discussion[] = $discussions[0];
        }

        return $this->render('accueil.html.twig', [
            'user' => $user,
            'discussions' => $liste_discussion,
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
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        foreach($user->getDiscussions() as $discussion){
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
    public function startDiscussion(HubInterface $hub, int $membre, DiscussionRepository $discussion_repository, UsersRepository $user_repository, EntityManagerInterface $entityManager): Response
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $discussion = new Discussion();
        $discussion->addMembre($user_repository->find($user->getId()));
        $discussion->addMembre($user_repository->find($membre));
        $discussion_repository->add($discussion, true);
        $update = new Update('https://discussion/'.$membre ,json_encode(["id" => $discussion->getId()]));
        $hub->publish($update);

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

        if(count($discussions) > 1){
            for($i=0; $i<count($discussions); $i++){
                $tmp = $i;
                for($j=$i+1; $j<count($discussions); $j++){
                    if($discussions[$tmp] ->getLastMessage() != null && $discussions[$j] ->getLastMessage() != null){
                        if($discussions[$tmp]->getLastMessage()->getDateEnvoi() < $discussions[$j]->getLastMessage()->getDateEnvoi()){
                            $tmp = $j;
                        }
                    }
                }
                $liste_discussion[] = $discussions[$tmp];
                $discussions[$tmp] = $discussions[$i];
            }
        }
        
        $idx = 0;
        for($i = 0; $i < count($liste_discussion);$i++){
            if(!$liste_discussion[$i] -> hasAnyMessage()){
                $message = '';
                $heure_message = '';
            }else{
                $message = $liste_discussion[$i]->getMessages()[count($liste_discussion[$i]->getMessages()) - 1]->getMessage();
                $heure_message = $liste_discussion[$i]->getMessages()[count($liste_discussion[$i]->getMessages()) - 1]->getDateEnvoi();
            }
            if(!$liste_discussion[$i]->getNom()){
                foreach($liste_discussion[$i]->getMembres() as $membre){
                    if ($membre->getUsername() != $user->getUsername()){
                        $nom = $membre->getUsername();
                    }
                }
            }else{
                $nom = $liste_discussion[$i] -> getNom();
            }
            $jsonData[$idx++] = ['id' => $liste_discussion[$i] -> getId(), 'nom' => $nom, 'photo' => $liste_discussion[$i]->getPhoto(), 'message' => $message, 'date_envoi' => $heure_message];
        }
        return new JsonResponse($jsonData);
    }

     /**
     * @Route("/discussion/recuperer", name="recuperer_discussion")
     */
    public function recupererDiscussion(Request $request, DiscussionRepository $discussion_repository):JsonResponse
    {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();
        $idDiscussion = $request->request->get('id');
        if(!$idDiscussion){
            return new JsonResponse('Erreur ajax!');
        }
        $discussion = $discussion_repository->find($idDiscussion);
        if(!$discussion){
            return new JsonResponse('Cette discussion n\'existe pas!');
        }
        
        if(!$discussion->getNom()){
            foreach($discussion->getMembres() as $membre){
                if ($membre->getUsername() != $user->getUsername()){
                    $nom = $membre->getUsername();
                }
            }
        }else{
            $nom = $discussion -> getNom();
        }
        if(!$discussion -> getPhoto()){
            $photo = $discussion ->getPhoto();
        }else{
            foreach($discussion->getMembres() as $membre){
                if ($membre->getUsername() != $user->getUsername()){
                    $photo = $membre->getPhoto();
                }
            }
        }
        $jsonData = ['nom' => $nom, 'photo' => $photo];
        
        return new JsonResponse($jsonData);
    }

    /**
     * @Route("/discussion/{id}", name="app_discussion")
     */
    public function conversation(int $id, DiscussionRepository $discussion_repository,Request $request, NotificationRepository $notification_repository, EntityManagerInterface $entityManager): Response
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
        
        //Récup table notif puis foreach pour savoir tout les ligne ou url fini par l'id de la conv si oui supp

        //$notification = $notification_repository->findAll();
        $notifs = $notification_repository->findAll();
        foreach($notifs as $notif){
            if($notif->getUrl() == 'discussion/' . $id){
                $notification_repository->remove($notif, true);
            }
        }

        return $this->render('discussion/index.html.twig', [
            'user' => $user,
            'titre' => $nom,
            'membres' => $discussion->getMembres(),
            'messages' => $discussion->getMessages(),
        ]);
}    
}
