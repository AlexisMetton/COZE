<?php

namespace App\Controller;

use App\Form\ResetPassType;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Controller\Users;
use App\Entity\Users as EntityUsers;
use Symfony\Component\Security\Core\User\User;

class SecurityController extends AbstractController
{
    /**
     * @Route("/home", name="home")
     */
    public function home(AuthenticationUtils $authenticationUtils): Response
    {
        return new Response('Vous êtes connecté');
    }

    /**
     * @Route("", name="app_login")
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    /**
     * @Route("/oubli-pass", name="app_forgotten_password")
     */
    public function forgottenPass(Request $request, UsersRepository $usersRepo, MailerInterface $mailer, TokenGeneratorInterface $tokenGenerator){
        //On crée le formulaire
        $form = $this->createForm(ResetPassType::class);

        //On traite le formulaire
        $form->handleRequest($request);

        //Si formulaire est valide
        if($form->isSubmitted() && $form->isValid()){
            //On récupère les données
            $donnes = $form->getData();
            
            //On cherche si un utilisateur a cet email
            $user = $usersRepo->findOneByEmail($donnes['email']);

            //Si utilisateur n'existe pas
            if(!$user){
                //On envoire un message flash
                $this->addFlash('danger', 'Cette adresse n\'existe pas');

                $this->redirectToRoute('app_login');
            }

            //On génère un token
            $token = $tokenGenerator->generateToken();

            try{
                $user->setResetToken($token);
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($user);
                $entityManager->flush();
            }catch(\Exception $e){
                $this->addFlash('Warning', 'Une erreur est survenue :'.$e->getMessage());
                return $this->redirectToRoute('app_login');
            }

            //On génère l'url de réinitialisation du mot de passe
            $url = $this->generateUrl('app_reset_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);

            $email = (new TemplatedEmail())
            ->from('alexis.metton@gmail.com')
            ->to($user->getEmail())
            ->subject('Réinitialisation de votre mot de passe')

            ->html("<p>Bonjour,</p><p>Une demande de réinitialisation de mot de passe a été effectuée pour le site COZE. Veuillez cliquer sur le lien suivant : " .$url.'</p>', 
            'text/html');
        
        $mailer->send($email);

        //On crée le message flash
        $this->addFlash('message', 'Un e-mail de réinitialisation de mot de passe a été envoyé');

        return $this->redirectToRoute('app_login');
        }

        // On envoie vers la page de demande de l'email
        return $this->render('security/forgotten_pass.html.twig', ['emailForm'=>$form->createView()]);
    }


    /**
     * @Route("/reset-pass/{token}", name="app_reset_password")
     */
    public function resetPassword($token, Request $request, UserPasswordEncoderInterface $passwordEncoder){
        //On cherche l'utilisateur avec le token fourni
        $user = $this->getDoctrine()->getRepository(EntityUsers::class)->findOneBy(['reset_token'=>$token]);

        if(!$user){
            $this->addFlash('danger', 'Token inconnu');
            return $this->redirectToRoute('app_login');
        }

        //Si le formulaire est envoyé en méthode POST
        if($request->isMethod('POST')){
            //On supprime le token
            $user->setResetToken(null);

            //On chiffre le mot de passe
            $user->setPassword($passwordEncoder->encodePassword($user, $request->request->get('password')));
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('message', 'Mot de passe modifié avec succès');

            return $this->redirectToRoute('app_login');
        }else{
            return $this->render('security/reset_password.html.twig', ['token' => $token]);
        }
    }
}
