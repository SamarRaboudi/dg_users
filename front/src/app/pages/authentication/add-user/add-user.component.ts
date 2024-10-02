import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';

// Define the Role interface
interface Role {
  value: string;
  viewValue: string;
  selected: boolean;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  user = {
    email: '',
    roles: [] as string[] // Explicitly declare roles as an array of strings
  };

  roles: Role[] = [ // Explicitly define the roles array with Role interface
    { value: 'ROLE_ADMIN', viewValue: 'Admin', selected: false },
    { value: 'ROLE_EDITOR', viewValue: 'Editor', selected: false },
    { value: 'ROLE_VIEWER', viewValue: 'Viewer', selected: false }
  ];

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    private userService: UserService
  ) {}

  // Update the user roles based on checkbox selection
  onRoleChange(roleValue: string, event: Event) {
    const checkbox = event.target as HTMLInputElement; // Cast the event target to HTMLInputElement
    const isChecked = checkbox.checked; // Safely access the checked property
    if (isChecked) {
      this.user.roles.push(roleValue); // Add the selected role
    } else {
      const index = this.user.roles.indexOf(roleValue);
      if (index >= 0) {
        this.user.roles.splice(index, 1); // Remove the unselected role
      }
    }
  }

  onSubmit() {
    this.userService.createUser(this.user).subscribe(
      (result) => {
        this.dialogRef.close(result); // Close the dialog and return the new user data
      },
      (error) => {
        console.error('Error creating user:', error);
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
