import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from 'src/app/pages/authentication/edit-user/edit-user.component';
import { AddUserComponent } from 'src/app/pages/authentication/add-user/add-user.component';
import { AuthorizationService } from 'src/app/core/services/authorization.service'; // Import your AuthorizationService

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: [],
})
export class FullComponent implements OnInit {
  @ViewChild('leftsidenav')
  public sidenav: MatSidenav;

  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  users: any[] = [];
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    public dialog: MatDialog,
    private authorizationService: AuthorizationService // Inject AuthorizationService
  ) {
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
      .subscribe((state) => {
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
      });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onEdit(user: any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user,
    });
    console.log(user);
  }

  onAddUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users.push(result); // Add the new user to the list
      }
    });
  }

  onDelete(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter((user) => user.id !== userId);
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
  }

  // Access control methods for buttons
  canAddUser(): boolean {
    return this.authorizationService.canAddUser();
  }

  canEditUser(): boolean {
    return this.authorizationService.canEditUser();
  }

  canDeleteUser(): boolean {
    return this.authorizationService.canDeleteUser();
  }
}
