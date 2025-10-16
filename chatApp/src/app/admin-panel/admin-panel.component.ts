import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  // ----- existing Requests tab state -----
  requests: any[] = [];
  groupRequests: any[] = [];
  allUsers: any[] = [];

  // ----- tab control -----
  currMode: 'req' | 'group' = 'req';

  // ----- Manage Groups tab state -----
  groups: any[] = [];
  loadingGroups = false;
  groupsError = '';

  constructor(
    private user: UserService,
    private group: GroupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load data for the Requests tab (your existing logic)
    this.user.getRequests().subscribe((res: any) => (this.requests = Array.isArray(res) ? res : []));
    this.group.getGroupRequests().subscribe((res: any) => (this.groupRequests = Array.isArray(res) ? res : []));
    this.user.getAllUsers().subscribe((res: any) => (this.allUsers = Array.isArray(res) ? res : []));
  }

  // ===== Requests tab actions =====
  approveRequest(req: any) {
    this.user.modifyReq(req, 'approve');
    this.user.getRequests().subscribe((res: any) => {
      this.requests = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }

  rejectRequest(req: any) {
    this.user.modifyReq(req, 'reject');
    this.user.getRequests().subscribe((res: any) => {
      this.requests = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }

  deleteUser(userId: number) {
    this.user.deleteUser(userId);
    this.user.getAllUsers().subscribe((res: any) => {
      this.allUsers = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }

  approveGroupRequest(req: any) {
    this.group.modifyGroupReq('approve', req);
    this.updateGroupRequests();
  }

  rejectGroupRequest(req: any) {
    this.group.modifyGroupReq('reject', req);
    this.updateGroupRequests();
  }

  updateGroupRequests() {
    this.group.getGroupRequests().subscribe((res: any) => {
      this.groupRequests = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }

  // ===== Tabs =====
  reqMode() {
    this.currMode = 'req';
  }

  groupMode() {
    this.currMode = 'group';
    this.loadGroups();   // <<< IMPORTANT: actually fetch groups when tab opened
  }

  // ===== Manage Groups loader =====
  private loadGroups() {
    this.loadingGroups = true;
    this.groupsError = '';
    this.group.getGroups().subscribe({
      next: (res: any[]) => {
        this.groups = Array.isArray(res) ? res : [];
        this.loadingGroups = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[AdminPanel] /groups error:', err);
        this.groupsError = 'Failed to load groups';
        this.loadingGroups = false;
        this.cdr.detectChanges();
      },
    });
  }
}
