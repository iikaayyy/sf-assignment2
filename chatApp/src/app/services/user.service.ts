import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  URL = `http://localhost:3000`;

  //OBSERVABLE VALUES
  private loggedIn = new BehaviorSubject<boolean>(this.getInitialLoginState());
  loggedIn$ = this.loggedIn.asObservable(); //Current login status as an observable

  private user = new BehaviorSubject<any>(this.getInitialUser());
  user$ = this.user.asObservable(); //Current User as an observable

  constructor(private http: HttpClient) {
    console.log('user service');
  }

  //get login state
  private getInitialLoginState() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  }

  //get user if initialLoginState is true
  private getInitialUser(): any {
    //if user exists in localStorage then return user
    if (this.getInitialLoginState()) {
      const user = JSON.parse(localStorage.getItem('user'));

      return user;
    } else return null;
  }

  //validate login details
  validateLogin = (username: string, password: string) =>
    this.http.post<any>(this.URL + '/login', {
      username,
      password,
    });

  //sign up route
  signUp(email, username, password) {
    // console.log(email, username, password);
    return this.http.post(this.URL + '/sign-up', { email, username, password });
  }

  getRequests = () => this.http.get(this.URL + '/requests'); //get sign up reqs

  modifyReq(req, type) {
    console.log(req, type);
    this.http
      .post(this.URL + '/modify-request', { req, type })
      .subscribe((res) => {
        console.log(res);
      });
  } //accept or reject signUp request

  setUser(user: object) {
    this.loggedIn.next(true);
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  deleteUser(userId) {
    this.http
      .post(this.URL + '/delete-user', { id: userId })
      .subscribe((res) => {
        console.log(res);
      });

    this.user$.subscribe((val) => {
      if (val.id === userId) this.logout();
    });
  }

  getAllUsers = () => this.http.get(this.URL + '/users');

  logout() {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    // console.log(file, userId);
    formData.append('avatar', file); // Append the file to FormData

    this.http.post(this.URL + '/upload-avatar', formData).subscribe((res) => {
      console.log(res);
      alert('log in again to view changes!');
    });
  }
}
