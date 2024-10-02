import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  editUserForm: FormGroup;
  rolesList: string[] = ['admin', 'viewer', 'editor'];  // Define available roles
  roleMapping: { [key: string]: string } = {   // Map user-friendly roles to backend roles
    admin: 'ROLE_ADMIN',
    viewer: 'ROLE_VIEWER',
    editor: 'ROLE_EDITOR'
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserComponent>,
    private userService: UserService,  // Inject UserService
    @Inject(MAT_DIALOG_DATA) public data: any  // Inject the passed data (user)
  ) {
    this.editUserForm = this.fb.group({
      email: [data.email, [Validators.required, Validators.email]],
      roles: [this.initRolesArray(data.roles)],  // Initialize roles as an array of booleans
    });
  }

  // Initialize the roles based on user's existing roles
  initRolesArray(existingRoles: string[]): boolean[] {
    console.log('Existing Roles:', existingRoles); // Debug log
    const initializedRoles = this.rolesList.map(role => existingRoles.includes(this.roleMapping[role]));
    console.log('Initialized Roles:', initializedRoles); // Debug log
    return initializedRoles;
  }

  // Call the API to update the user
  save() {
    if (this.editUserForm.valid) {
      const updatedUser = {
        email: this.editUserForm.value.email,
        roles: this.rolesList
          .filter((_, index) => this.editUserForm.value.roles[index])  // Only include selected roles
          .map(role => this.roleMapping[role])  // Map to backend role strings
      };

      console.log('Updated User:', updatedUser); // Debug log

      const userId = this.data.id;  // Assuming the user ID is passed in the data

      // Call the updateUser method from the UserService
      this.userService.updateUser(userId, updatedUser).subscribe(
        (response) => {
          // Handle success
          console.log('User updated successfully:', response);
          this.dialogRef.close(response);  // Pass the updated user back
        },
        (error) => {
          // Handle error
          console.error('Error updating user:', error);
        }
      );
    }
  }

  // Close dialog without saving
  close() {
    this.dialogRef.close();
  }
}
