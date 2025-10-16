import { GroupInterface } from './group.model';

class Group implements GroupInterface {
  users;
  admins;
  channels;

  constructor(public groupId, public groupName) {}
}
