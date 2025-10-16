import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  URL = 'http://localhost:3000';

  public groups: any[] = [];
  private user: any; // current user

  private userGroups = new BehaviorSubject<any[]>([]);
  userGroups$ = this.userGroups.asObservable();

  private otherGroups = new BehaviorSubject<any[]>([]);
  otherGroups$ = this.otherGroups.asObservable();

  constructor(private http: HttpClient, public userService: UserService) {
    console.log('group service');
    this.getCurrentUser();
  }

  /** Fetch a specific group by name */
  public getGroupDetails = (groupName: string) =>
    this.groups.find((group) => group.name === groupName);

  /** Subscribe to current user and refresh group lists */
  private getCurrentUser() {
    this.userService.user$.subscribe((val) => {
      this.user = val;
      this.assignAllGroups();
    });
  }

  /** Load all groups from backend and split into “my” vs “others” */
  private assignAllGroups() {
    this.http.get<any[]>(`${this.URL}/groups`).subscribe((val) => {
      this.groups = val || [];
      if (typeof window !== 'undefined' && this.user) {
        const userGrps = this.groups.filter((group) =>
          this.user.groups.includes(group.id)
        );
        this.userGroups.next(userGrps);

        const otherGrps = this.groups.filter(
          (group) => !this.user.groups.includes(group.id)
        );
        this.otherGroups.next(otherGrps);
      }
    });
  }

  /** Request to join a group */
  joinGroup(groupName: string, groupId: number) {
    const body = {
      userId: this.user.id,
      groupId,
      groupName,
      username: this.user.username,
    };
    return this.http.post(`${this.URL}/join-group`, body);
  }

  /** Admin: get all pending join requests */
  getGroupRequests = () => this.http.get(`${this.URL}/join-group-reqs`);

  /** Remove user from a group */
  removeUser(userId: number, groupId: number) {
    this.http
      .post(`${this.URL}/remove-user`, { userId, groupId })
      .subscribe((res: any) => {
        if (res?.user) this.userService.setUser(res.user);
      });
  }

  /** Create a new group */
  addGroup(groupName: string) {
    this.http
      .post(`${this.URL}/create-group`, {
        name: groupName,
        userId: this.user.id,
      })
      .subscribe((res: any) => {
        if (res.status === 'OK') this.userService.setUser(res.user);
      });
  }

  /** Approve or reject a group join request */
  modifyGroupReq(type: string, request: any) {
    const body = { type, request };
    this.http
      .post(`${this.URL}/modify-group-request`, body)
      .subscribe((val) => console.log(val));
  }

  /** ✅ FIXED: Return live data from backend instead of cached value */
  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/groups`);
  }
}
