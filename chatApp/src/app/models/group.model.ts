import { UserInterface } from './user.model';

export interface GroupInterface {
  groupId: number;
  groupName: string;
  users: UserInterface[];
  admins: UserInterface[];
  channels: [];
}
