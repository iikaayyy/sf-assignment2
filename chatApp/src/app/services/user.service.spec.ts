import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';

describe('UserService', () => {
  let service: UserService;
  let httpTesting;
  const mockRequests = [
    { id: 1, name: 'Request 1' },
    { id: 2, name: 'Request 2' },
  ];

  const mockUsers = [
    { id: 1, username: 'User1', email: 'user1@example.com' },
    { id: 2, username: 'User2', email: 'user2@example.com' },
    { id: 3, username: 'User3', email: 'user3@example.com' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch sign-up requests', async () => {
    const requests$ = service.getRequests();
    const requestsPromise = firstValueFrom(requests$);
    const req = httpTesting.expectOne(service.URL + '/requests');
    expect(req.request.method).toBe('GET');
    req.flush(mockRequests);
    expect(await requestsPromise).toEqual(mockRequests);
  });

  it('should get all users', async () => {
    const requests$ = service.getAllUsers();
    const requestsPromise = firstValueFrom(requests$);
    const req = httpTesting.expectOne(
      {
        method: 'GET',
        url: service.URL + '/users',
      },
      'Request to load the configuration'
    );
    req.flush(mockUsers);
    expect(await requestsPromise).toEqual(mockUsers);
  });

  it('should validate user login', async () => {
    const mockUser = { id: 1, username: 'user1', email: 'u1@u.com' }; //mock user
    const username = 'user1';
    const password = '123';

    //call method
    const requests$ = service.validateLogin(username, password);
    const res = firstValueFrom(requests$);

    const req = httpTesting.expectOne({
      method: 'POST',
      url: service.URL + '/login',
      body: { username, password },
    });

    req.flush(mockUser);
    expect(await res).toEqual(mockUser);
  });

  it('should send user data to sign up', async () => {
    const mockUser = { username: 'user1', email: 'u1@u.com', password: '123' }; //mock user
    const email = 'u1@u.com';
    const username = 'user1';
    const password = '123';

    //call method
    const requests$ = service.signUp(email, username, password);
    const res = firstValueFrom(requests$);

    const req = httpTesting.expectOne({
      method: 'POST',
      url: service.URL + '/sign-up',
      body: { username, password, email },
    });

    req.flush(mockUser);
    expect(await res).toEqual(mockUser);
  });
});
