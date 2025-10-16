import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  requests;
  groupRequests;
  allUsers;
  currMode = 'req';

  constructor(
    private user: UserService,
    private group: GroupService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.user.getRequests().subscribe((res) => {
      this.requests = res;
      // console.log(this.requests);
    });

    this.group.getGroupRequests().subscribe((res) => {
      this.groupRequests = res;
      console.log(this.groupRequests);
    });

    this.user.getAllUsers().subscribe((res) => {
      this.allUsers = res;
      console.log(this.allUsers);
    });
  }

  approveRequest(req) {
    this.user.modifyReq(req, 'approve');
    this.user.getRequests().subscribe((res) => {
      this.requests = res;
      // console.log(this.requests);
      this.cdr.detectChanges();
    });
  }

  deleteUser(userId) {
    console.log(userId);
    this.user.deleteUser(userId);
    this.user.getAllUsers().subscribe((res) => {
      this.allUsers = res;
    });
    this.cdr.detectChanges();
  }

  rejectRequest(req) {
    this.user.modifyReq(req, 'reject');
    this.user.getRequests().subscribe((res) => {
      this.requests = res;
      this.cdr.detectChanges();
    });
  }

  approveGroupRequest(req) {
    this.group.modifyGroupReq('approve', req);

    this.updateGroupRequests();
  }

  rejectGroupRequest(req) {
    this.group.modifyGroupReq('reject', req);

    this.updateGroupRequests();
  }

  updateGroupRequests() {
    this.group.getGroupRequests().subscribe((res) => {
      this.groupRequests = res;
      console.log(this.groupRequests);
      this.cdr.detectChanges();
    });
  }

  reqMode() {
    this.currMode = 'req';
  }

  groupMode() {
    this.currMode = 'group';
  }
}
