<?php

// src/Service/UserService.php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;
    private EntityManagerInterface $entityManager;

    public function __construct(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager)
    {
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    public function createUser(User $user): void
    {
        $resetToken = bin2hex(random_bytes(16));
        $user->setResetToken($resetToken);

        // Use a prompt for the password in real scenarios
        $password = "123456"; // Placeholder
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $this->userRepository->save($user);
    }

    public function getAllUsers(): array
    {
        return $this->userRepository->findAll();
    }

    public function findUserById(int $id): ?User
    {
        return $this->userRepository->find($id);
    }

    public function updateUser(User $updatedUser): void
    {
        $this->entityManager->persist($updatedUser);
        $this->entityManager->flush();
    }

    public function resetPassword(string $resetToken, string $newPassword): bool
    {
        $user = $this->userRepository->findOneBy(['resetToken' => $resetToken]);

        if (!$user) {
            return false;
        }

        $hashedPassword = $this->passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($hashedPassword);
        $user->setResetToken(null);

        $this->userRepository->save($user);

        return true;
    }
    public function deleteUser(User $user): void
    {
        // Remove the user from the database using the EntityManager
        $this->entityManager->remove($user);
        $this->entityManager->flush(); // Ensure changes are saved
    }

    
}
