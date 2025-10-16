import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let app: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it('should dispay login page by default', () => {
    expect(app.currMode).toBe('login');
  });

  it('should switch to sign-up mode', () => {
    app.switchMode();
    fixture.detectChanges();
    expect(app.currMode).toBe('signup');
  });
});
