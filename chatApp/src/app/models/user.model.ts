export interface UserInterface {
  valid: Boolean;
  user: {
    username: string;
    password: string;
    email: string;
    id: number;
    roles: [];
    groups: [];
  };

  //join any channel once member of group
  //register interest in a group
  //leave group(s)
  //deleteSelf
}

// export interface GroupAdminInterface {
//   createGroup();
//   createChannel();
//   removeGroup();
//   removeChannel();
//   removeChatUsers();
//   ban();
// }

// export interface SuperUserInterface extends GroupAdminInterface {
//   promoteToAdmin();
//   promoteToSuperAdmin();
// }

// export interface SuperUserInterface extends UserInterface {
//   promote(user: UserInterface, level: UserRole);
//   remove(user: UserInterface);
// }

// Super Admin
//Promote user to admin
//remove chat user
//upgrade normal user to super admin role
//All of the functions of a group administrator

//Group Admin
//Create Groups
//Create channels within groups
//Remove channels, users, groups from group they created/administer
//ban a user from channel and report to super admins

//Chat User
//join any channel
//register interest in a group
//leave a group
//delete themselves
//unique username
//logout
