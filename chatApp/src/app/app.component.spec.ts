import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { BehaviorSubject } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let userServiceMock;
  let routerMock;

  const loggedInSubject = new BehaviorSubject<boolean>(false);
  const userSubject = new BehaviorSubject({
    id: 1,
    username: 'test',
    roles: 'SU',
  });

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    userServiceMock = {
      // Mocking loggedIn$ as an observable from BehaviorSubject
      loggedIn$: loggedInSubject.asObservable(),
      user$: userSubject.asObservable(), // Mock the user$ observable
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }, // Provide the mock route
      ],
      declarations: [AppComponent, NavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
    expect(app).toBeDefined();
  });

  it(`should have as title 'chatApp'`, () => {
    expect(app.title).toEqual('chatApp');
  });

  it('should navigate to "groups" when logged in', () => {
    // Simulate logged-in state
    loggedInSubject.next(true);
    fixture.detectChanges(); // Trigger change detection

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('groups'); // Verify navigation
  });

  it('should navigate to "login" when logged out', () => {
    // Simulate logged-out state
    loggedInSubject.next(false);
    fixture.detectChanges(); // Trigger change detection

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('login'); // Verify navigation
  });
});
