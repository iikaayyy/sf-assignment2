import { Component, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.css',
})
export class GroupChatComponent implements OnInit {
  currGroup;
  currUser;

  selectedChannel: string;

  constructor(
    private group: GroupService,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const name = paramMap.get('name');
      this.currGroup = this.group.getGroupDetails(name);
    });

    this.user.user$.subscribe((val) => {
      this.currUser = val;
    });
  }

  leaveGroup() {
    this.group.removeUser(this.currUser.id, this.currGroup?.id);
    console.log('leaving');
    this.router.navigateByUrl('/groups');
  }

  joinChannel() {
    if (this.selectedChannel)
      this.router.navigate([
        'groups',
        this.currGroup.name,
        this.selectedChannel,
      ]);
    else alert('please select a channel to chat in');
  }
}
