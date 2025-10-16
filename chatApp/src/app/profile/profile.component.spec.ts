import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from '../services/user.service';

describe('ProfileComponent', () => {
  let app: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceMock;

  const userSubject = new BehaviorSubject({
    id: 1,
    username: 'test',
    roles: ['SU'],
  });

  userServiceMock = {
    user$: userSubject.asObservable(), // Mock the user$ observable
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });
});
