import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { GroupService } from './group.service';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';

describe('GroupService', () => {
  let service: GroupService;
  let httpTesting;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        GroupService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(GroupService);
    httpTesting = TestBed.inject(HttpTestingController);

    service.groups = [
      { id: 1, name: 'Group One', description: 'First group' },
      { id: 2, name: 'Group Two', description: 'Second group' },
      { id: 3, name: 'Group Three', description: 'Third group' },
    ];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all group requests', async () => {
    const request = service.getGroupRequests();
    const res = firstValueFrom(request);

    const req = httpTesting.expectOne(
      {
        method: 'GET',
        url: service.URL + '/join-group-reqs',
      },
      'Request to load the configuration'
    );

    req.flush('groups');
    expect(await res).toEqual('groups');
  });

  it('should join group', async () => {
    const mockUser = {
      userId: 1,
      username: 'user1',
    };
    const groupName = 'Test Group'; // Mock group name
    const groupId = 'group123'; // Mock group ID
    service['user'] = mockUser;
    const request = service.joinGroup('fitness', 1);

    const res = firstValueFrom(request);

    const req = httpTesting.expectOne(
      {
        method: 'POST',
        url: service.URL + '/join-group',
      },
      'Request to load the configuration'
    );

    req.flush('groups');
    expect(await res).toEqual('groups');
  });

  it('should return the correct group details for a valid group name', () => {
    const groupName = 'Group Two';
    const groupDetails = service.getGroupDetails(groupName);

    expect(groupDetails).toBeTruthy(); // Check that a group is returned
    expect(groupDetails.name).toBe(groupName); // Verify the returned group name
    expect(groupDetails.description).toBe('Second group'); // Verify the returned description
  });

  it('should return undefined for an invalid group name', () => {
    const groupName = 'Nonexistent Group';
    const groupDetails = service.getGroupDetails(groupName);

    expect(groupDetails).toBeUndefined(); // Expect no group to be found
  });
});
