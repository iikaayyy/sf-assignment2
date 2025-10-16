import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  user;
  userGroups;
  constructor(public userService: UserService, public group: GroupService) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((val) => {
      this.user = val;
      console.log(this.user.avatar);
    });

    this.group.userGroups$.subscribe((val) => {
      this.userGroups = val;
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files[0];

    if (file) {
      const ext = file.name.split('.').pop();
      const newFileName = `user${this.user.id}.${ext}`;
      const renamedFile = new File([file], newFileName, { type: file.type });

      this.userService.uploadAvatar(renamedFile);
    } else {
      console.log('No file selected'); // Log if no file is selected
    }
  }

  deleteAccount() {
    this.userService.deleteUser(this.user.id);
  }
}
