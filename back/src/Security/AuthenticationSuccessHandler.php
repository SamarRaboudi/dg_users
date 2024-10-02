<?php

// src/Security/AuthenticationSuccessHandler.php

namespace App\Security;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private JWTTokenManagerInterface $jwtManager;
    private AuthorizationCheckerInterface $authorizationChecker;

    public function __construct(
        JWTTokenManagerInterface $jwtManager, 
        AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->jwtManager = $jwtManager;
        $this->authorizationChecker = $authorizationChecker;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        $user = $token->getUser();
        $roles = $user->getRoles();
        
     
        $payload = [
            'idUser' => $user->getId(),
            'id' => $user->getUserIdentifier(),
            'roles' => $roles,
        ];
    
        $token = $this->jwtManager->create($user, $payload);
        $responseContent = [
            'token' => $token,
            'idUser' => $payload['idUser'],
            'id' => $payload['id'],
            'roles' => $payload['roles'],
        ];
    
        // Return a JSON response with the updated JSON object
        return new JsonResponse($responseContent);
    }
    
    
}
