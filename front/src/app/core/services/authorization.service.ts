import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() { }

  // Retrieve user roles from local storage
  getUserRoles(): string[] {
    const rolesString = localStorage.getItem('roles');
    return rolesString ? JSON.parse(rolesString) : [];
  }

  // Check if the user has at least one of the required roles
  hasAccess(requiredRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }

  // Role-specific access methods
  canAddUser(): boolean {
    return this.hasAccess(['ROLE_ADMIN']);
  }

  canEditUser(): boolean {
    return this.hasAccess(['ROLE_ADMIN', 'ROLE_EDITOR']);
  }

  canDeleteUser(): boolean {
    return this.hasAccess(['ROLE_ADMIN', 'ROLE_EDITOR']);
  }

  canViewUser(): boolean {
    return this.hasAccess(['ROLE_ADMIN', 'ROLE_EDITOR', 'ROLE_VIEWER']);
  }
}
