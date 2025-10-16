import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('DashboardComponent', () => {
  let app: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [FormsModule],
    }).compileComponents();

    router = TestBed.inject(Router); // Get the router instance
    fixture = TestBed.createComponent(DashboardComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it('should display modal when creating groups for entering details', () => {
    app.showModal();
    fixture.detectChanges();
    expect(app.showInput).toBe(true);
  });

  it('should navigate to the groups page with group name', () => {
    const navigateSpy = spyOn(router, 'navigate'); // Spy on the navigate method

    const groupName = 'exampleGroup'; // Example group name
    app.enterGroup(groupName); // Call the method to test

    // Check if navigate was called with the correct arguments
    expect(navigateSpy).toHaveBeenCalledWith(['groups', groupName]);
  });

  it('should hide input when group name is submitted', () => {
    app.onSubmit(); //scall the fn
    fixture.detectChanges(); //detect changes
    // Check if navigate was called with the correct arguments
    expect(app.showInput).toBe(false);
  });
});
