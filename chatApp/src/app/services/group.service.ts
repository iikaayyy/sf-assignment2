import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  URL = 'http://localhost:3000';

  public groups;

  private user; //current user

  private userGroups = new BehaviorSubject<any>(undefined);
  userGroups$ = this.userGroups.asObservable();

  private otherGroups = new BehaviorSubject<any>(undefined);
  otherGroups$ = this.otherGroups.asObservable();

  constructor(private http: HttpClient, public userService: UserService) {
    console.log('group service');
    this.getCurrentUser();
  }

  public getGroupDetails = (groupName) =>
    this.groups.find((group) => group.name === groupName);

  private getCurrentUser() {
    this.userService.user$.subscribe((val) => {
      this.user = val;
      this.assignAllGroups();
    });
  }

  private assignAllGroups() {
    this.http.get(this.URL + '/groups').subscribe((val) => {
      this.groups = val; //get all ghe gorups
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

  joinGroup(groupName, groupId) {
    console.log(this.user.username, groupName, groupId);
    const body = {
      userId: this.user.id,
      groupId,
      groupName,
      username: this.user.username,
    };
    return this.http.post(this.URL + '/join-group', body);
  }

  getGroupRequests = () => this.http.get(this.URL + '/join-group-reqs');

  removeUser(userId, groupId) {
    console.log(userId, groupId);
    this.http
      .post(this.URL + '/remove-user', { userId, groupId })
      .subscribe((res: any) => {
        this.userService.setUser(res.user);
      });
  }

  addGroup(groupName) {
    this.http
      .post(this.URL + '/create-group', {
        name: groupName,
        userId: this.user.id,
      })
      .subscribe((res: any) => {
        if (res.status === 'OK') this.userService.setUser(res.user); //need to update user which will trigger this user to update
      });
  }

  modifyGroupReq(type, request) {
    const body = { type, request };
    console.log(request);
    this.http
      .post(this.URL + '/modify-group-request', body)
      .subscribe((val) => {
        console.log(val);
      });
  }

  getGroups() {
    return this.groups;
  }
}
