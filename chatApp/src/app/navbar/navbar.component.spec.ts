import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let app: NavbarComponent;
  let routerMock;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock }, // Provide the mock route
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it('should navigate to AdminPanel when clicked', () => {
    app.adminPanel();
    fixture.detectChanges(); // Trigger change detection
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/admin-panel'); // Verify navigation
  });

  it('should navigate to Dashboard when clicked', () => {
    app.dashboard();
    fixture.detectChanges(); // Trigger change detection
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/groups'); // Verify navigation
  });

  it('should navigate to Profile Page when clicked', () => {
    app.profile();
    fixture.detectChanges(); // Trigger change detection
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/profile'); // Verify navigation
  });
});
