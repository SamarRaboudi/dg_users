<?php

// src/Controller/UserController.php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    #[Route('/api/users/new', name: 'create_user', methods: ['POST'])]
    public function createUser(Request $request, ValidatorInterface $validator): JsonResponse
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Access denied: insufficient permissions.'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        
        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->userService->createUser($user);
            return $this->json(['message' => 'User created successfully!'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/users', name: 'get_users', methods: ['GET'])]
    public function getUsers(): JsonResponse
    {
        if (!$this->isGranted('ROLE_VIEWER') && !$this->isGranted('ROLE_EDITOR') && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Access denied: insufficient permissions.'], Response::HTTP_FORBIDDEN);
        }

        $users = $this->userService->getAllUsers();
        return $this->json($users, Response::HTTP_OK);
    }

    #[Route('/api/users/update/{id}', name: 'edit_user', methods: ['PUT'])]
    public function editUser(int $id, Request $request, ValidatorInterface $validator): JsonResponse
    {
        if (!$this->isGranted('ROLE_EDITOR') && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Access denied: insufficient permissions.'], Response::HTTP_FORBIDDEN);
        }

        $user = $this->userService->findUserById($id);

        if (!$user) {
            return $this->json(['error' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $user->setEmail($data['email'] ?? $user->getEmail());
        $user->setRoles($data['roles'] ?? $user->getRoles());

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->userService->updateUser($user);
            return $this->json(['message' => 'User updated successfully!'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    #[Route('/api/users/delete/{id}', name: 'delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        // Check if the authenticated user has at least ROLE_EDITOR or ROLE_ADMIN
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Access denied: insufficient permissions.'], Response::HTTP_FORBIDDEN);
        }

        // Fetch the user entity by ID
        $user = $this->userService->findUserById($id);

        if (!$user) {
            return $this->json(['error' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        // Delete the user using the UserService
        try {
            $this->userService->deleteUser($user);
            return $this->json(['message' => 'User deleted successfully!'], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    #[Route('/api/users/{id}', name: 'get_user_by_id', methods: ['GET'])]
    public function getUserById(int $id): JsonResponse
    {
        // Check if the authenticated user has at least ROLE_VIEWER
        if (!$this->isGranted('ROLE_VIEWER') && !$this->isGranted('ROLE_EDITOR') && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Access denied: insufficient permissions.'], Response::HTTP_FORBIDDEN);
        }

        // Fetch the user entity by ID
        $user = $this->userService->findUserById($id);

        if (!$user) {
            return $this->json(['error' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        // Return the user details in the response
        return $this->json($user, Response::HTTP_OK);
    }
}
