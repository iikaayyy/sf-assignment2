import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { GroupChatComponent } from './group-chat.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';
import { FormsModule } from '@angular/forms';

describe('GroupChatComponent', () => {
  let app: GroupChatComponent;
  let fixture: ComponentFixture<GroupChatComponent>;
  let routerMock: Router;
  let groupServiceMock;
  let userServiceMock;

  const userSubject = new BehaviorSubject({
    id: 1,
    username: 'test',
    roles: ['SU'],
  });

  beforeEach(async () => {
    groupServiceMock = {
      removeUser: jasmine.createSpy('removeUser'), // Spy for removeUser method
      getGroupDetails: jasmine
        .createSpy('getGroupDetails')
        .and.returnValue({ name: 'Test Group', id: 1 }),
    };

    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    userServiceMock = {
      user$: userSubject.asObservable(), // Mock the user$ observable
    };

    await TestBed.configureTestingModule({
      declarations: [GroupChatComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (param: string) => {
                return param === 'name' ? 'testGroup' : null; // Mock the get method
              },
            }),
          },
        },
        { provide: UserService, useValue: userServiceMock },
        { provide: GroupService, useValue: groupServiceMock },
        { provide: Router, useValue: routerMock }, // Provide the mock router here
      ],
      imports: [RouterTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupChatComponent);
    app = fixture.componentInstance;

    // Set the current user and group
    app.currUser = { id: 1 }; // Mock current user
    app.currGroup = { id: 1 }; // Mock current group

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it(`should navigate to '/groups' upon leaving the group`, () => {
    app.leaveGroup(); // Call leaveGroup method
    expect(groupServiceMock.removeUser).toHaveBeenCalledWith(
      app.currUser.id,
      app.currGroup.id
    ); // Verify removeUser was called
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/groups'); // Verify navigation
  });
});
