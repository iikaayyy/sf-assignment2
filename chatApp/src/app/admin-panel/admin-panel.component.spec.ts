import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelComponent } from './admin-panel.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminPanelComponent', () => {
  let app: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPanelComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPanelComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it(`Should change the mode to 'Requests' when clicked`, () => {
    app.reqMode();
    fixture.detectChanges();
    expect(app.currMode).toBe('req');
  });

  it(`Should change the mode to 'Group Requests' when clicked`, () => {
    app.groupMode();
    fixture.detectChanges();
    expect(app.currMode).toBe('group');
  });
});
